"use client";
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, X } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name is required for registration"),
});

type AuthFormData = {
  email: string;
  password: string;
  name?: string;
};

const Auth = () => {
  const [isLogin, setIsLogin] = React.useState(true);
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<AuthFormData>({
    resolver: zodResolver(isLogin ? loginSchema : signupSchema)
  });

  // Redirect if already logged in
  React.useEffect(() => {
    if (!authLoading && user) {
      const redirectPath = searchParams?.get('redirect') || (isAdmin ? '/admin' : '/profile');
      router.replace(redirectPath);
    }
  }, [user, isAdmin, authLoading, router, searchParams]);

  // Reset form errors when switching modes
  React.useEffect(() => {
    reset();
    setError('');
  }, [isLogin, reset]);

  const onSubmit = async (data: any) => {
    if (!isSupabaseConfigured) {
      setError('Database is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        if (authError) throw authError;

        // Fetch role immediately for faster redirect
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authData.user.id)
          .single();
        
        const FIRST_ADMIN_EMAIL = "admin@example.com";
        
        if ((profileData && profileData.role === 'admin') || authData.user.email === FIRST_ADMIN_EMAIL) {
          router.replace('/admin');
        } else {
          router.replace('/profile');
        }
      } else {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              full_name: data.name,
            }
          }
        });

        if (authError) throw authError;
        
        // Profile is now handled by the Database Trigger for reliability
        
        if (authData.session) {
          router.replace('/profile');
        } else {
          setError('Registration successful! Please check your email to confirm your account before logging in.');
          setLoading(false);
          reset();
        }
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4 pt-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full glass-card p-10 relative z-10"
      >
        <div className="text-center mb-10">
          <div className="h-16 w-48 relative mx-auto mb-6">
            <img 
              src="/images/logo.png" 
              alt="JMC Logo" 
              className="h-full w-full object-contain"
            />
          </div>
          <h2 className="text-4xl font-bold text-white font-display">{isLogin ? 'Welcome Back' : 'Join the Club'}</h2>
          <p className="text-zinc-400 mt-3 leading-relaxed">{isLogin ? 'Enter your credentials to access your account' : 'Create an account to join the Josephite Math community'}</p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 relative overflow-hidden"
            >
              <div className="flex-shrink-0 mt-0.5">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-grow">
                <p className="text-sm text-red-400 font-medium leading-relaxed">{error}</p>
              </div>
              <button 
                type="button"
                onClick={() => setError('')}
                className="flex-shrink-0 p-1 hover:bg-red-500/20 rounded-lg transition-colors text-red-500/50 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

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
