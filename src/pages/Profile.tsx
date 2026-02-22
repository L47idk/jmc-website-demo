"use client";
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { User, Mail, Shield, Calendar } from 'lucide-react';

const Profile = () => {
  const { user, profile, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center text-zinc-400">Loading...</div>;
  if (!user) return <div className="min-h-screen flex items-center justify-center text-zinc-400">Please login to view profile.</div>;

  return (
    <div className="min-h-screen relative py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card overflow-hidden"
        >
          <div className="h-40 bg-gradient-to-r from-amber-600 to-amber-800 relative">
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          <div className="px-10 pb-10">
            <div className="relative -mt-20 mb-8">
              <div className="w-40 h-40 glass border-4 border-amber-500/20 rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden bg-black/60">
                <User className="w-20 h-20 text-amber-500/20" />
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
              <div>
                <h1 className="text-4xl font-bold text-white font-display mb-2">{profile?.name || 'Josephite Member'}</h1>
                <p className="text-zinc-400 flex items-center gap-2 text-lg">
                  <Mail className="w-5 h-5 text-amber-500" /> {user.email}
                </p>
              </div>
              <span className={`px-5 py-2 rounded-full text-sm font-bold uppercase tracking-widest shadow-lg ${
                profile?.role === 'admin' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20' : 'bg-zinc-500/20 text-zinc-400 border border-white/10'
              }`}>
                {profile?.role || 'Member'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all">
                <div className="flex items-center gap-4 text-zinc-500 mb-3">
                  <Shield className="w-6 h-6 text-amber-500" />
                  <span className="text-sm font-bold uppercase tracking-widest">Account Status</span>
                </div>
                <p className="text-white text-xl font-bold font-display">Active Member</p>
              </div>
              <div className="p-6 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all">
                <div className="flex items-center gap-4 text-zinc-500 mb-3">
                  <Calendar className="w-6 h-6 text-amber-500" />
                  <span className="text-sm font-bold uppercase tracking-widest">Joined Date</span>
                </div>
                <p className="text-white text-xl font-bold font-display">
                  {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
