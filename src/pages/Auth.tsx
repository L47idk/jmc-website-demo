"use client";
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'motion/react';
import { Sigma } from 'lucide-react';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2, "Name is required for registration"),
});

const Auth = () => {
  const [isLogin, setIsLogin] = React.useState(true);
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: any) => {
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
        // Fetch role immediately for faster redirect
        const docRef = doc(db, 'users', userCredential.user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists() && docSnap.data().role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/profile');
        }
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        
        // Update Firebase Auth profile
        const { updateProfile } = await import('firebase/auth');
        await updateProfile(userCredential.user, {
          displayName: data.name
        });

        await setDoc(doc(db, 'users', userCredential.user.uid), {
          name: data.name,
          email: data.email,
          role: 'member',
          createdAt: new Date().toISOString(),
        });
        router.push('/profile');
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full glass-card p-10 relative z-10"
      >
        <div className="text-center mb-10">
          <div className="h-16 w-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center text-black font-bold text-3xl mx-auto mb-6 shadow-xl shadow-amber-600/20">
            J
          </div>
          <h2 className="text-4xl font-bold text-white font-display">{isLogin ? 'Welcome Back' : 'Join the Club'}</h2>
          <p className="text-zinc-400 mt-3 leading-relaxed">{isLogin ? 'Enter your credentials to access your account' : 'Create an account to join the Josephite Math community'}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 text-red-400 text-sm rounded-xl border border-red-500/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Full Name</label>
              <input
                {...register('name')}
                className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                placeholder="John Doe"
              />
              {errors.name && <p className="text-xs text-red-400 mt-2">{errors.name.message as string}</p>}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Email Address</label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all"
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-xs text-red-400 mt-2">{errors.email.message as string}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Password</label>
            <input
              {...register('password')}
              type="password"
              className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-xs text-red-400 mt-2">{errors.password.message as string}</p>}
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black rounded-xl font-bold hover:from-amber-400 hover:to-amber-500 transition-all shadow-xl shadow-amber-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              isLogin ? 'Sign In' : 'Sign Up'
            )}
          </motion.button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-amber-500 hover:text-amber-400 font-medium transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
