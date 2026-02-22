"use client";
import React from 'react';
import { useContent } from '../context/ContentContext';
import { motion } from 'motion/react';
import { ArrowRight, Calculator, Brain, Users } from 'lucide-react';
import Link from 'next/link';

const Home = () => {
  const { content, loading } = useContent();

  if (loading) return <div className="min-h-screen flex items-center justify-center text-zinc-400">Loading...</div>;

  const { home } = content;

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-1.5 mb-6 rounded-full glass text-amber-400 text-sm font-medium border-amber-500/20"
            >
              Est. 2015 • Excellence in Mathematics
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
              className="text-7xl md:text-9xl font-bold tracking-tighter text-white mb-8 font-display leading-[0.9]"
            >
              {home?.heroTitle?.split(' ').map((word: string, i: number) => (
                <span key={i} className={i === home.heroTitle.split(' ').length - 1 ? "gold-text block md:inline" : "block md:inline mr-4"}>
                  {word}
                </span>
              ))}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light"
            >
              {home?.heroSubtitle}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row justify-center gap-6"
            >
              <motion.div whileTap={{ scale: 0.95 }}>
                <Link
                  href="/panel"
                  className="px-10 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black rounded-full font-bold hover:from-amber-400 hover:to-amber-500 transition-all flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20"
                >
                  Join the Club <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
              <motion.div whileTap={{ scale: 0.95 }}>
                <Link
                  href="/about"
                  className="px-10 py-4 glass text-white rounded-full font-bold hover:bg-white/10 transition-all flex items-center justify-center"
                >
                  Our Story
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {home?.features?.map((feature: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-10 group hover:bg-white/10 transition-all duration-500"
              >
                <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 mb-8 group-hover:scale-110 transition-transform border border-amber-500/10">
                  {i % 3 === 0 ? <Calculator className="w-7 h-7" /> : i % 3 === 1 ? <Brain className="w-7 h-7" /> : <Users className="w-7 h-7" />}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 font-display">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
