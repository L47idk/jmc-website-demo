"use client";
import React from 'react';
import { useContent } from '../context/ContentContext';
import { motion } from 'motion/react';

const About = () => {
  const { content, loading } = useContent();

  if (loading) return <div className="min-h-screen flex items-center justify-center text-zinc-400">Loading...</div>;

  const { about } = content;

  return (
    <div className="min-h-screen relative py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 font-display">{about?.title}</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full shadow-lg shadow-amber-500/50"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-12 text-zinc-300 leading-relaxed text-lg border-amber-500/10"
        >
          <p className="whitespace-pre-wrap">{about?.text}</p>
        </motion.div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card p-10 border-amber-500/10">
            <h3 className="text-2xl font-bold text-white mb-6 font-display">Our Values</h3>
            <ul className="space-y-5">
              {['Inclusivity', 'Intellectual Curiosity', 'Collaboration', 'Excellence'].map((val) => (
                <li key={val} className="flex items-center gap-4">
                  <div className="w-2.5 h-2.5 bg-amber-500 rounded-full shadow-lg shadow-amber-500/50"></div>
                  <span className="text-zinc-300 font-medium">{val}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-card p-10">
            <h3 className="text-2xl font-bold text-white mb-6 font-display">Our Vision</h3>
            <p className="text-zinc-400 leading-relaxed">
              To become a leading hub for mathematical discovery and education, empowering students to solve real-world problems through rigorous logic and creative thinking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
