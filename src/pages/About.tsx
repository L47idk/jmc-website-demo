"use client";
import React from 'react';
import { motion } from 'motion/react';
import { Calculator, Trophy, Lightbulb, Heart } from 'lucide-react';

const About = () => {
  const stats = [
    { number: "7", label: "BDMO venue coordinator" },
    { number: "100+", label: "Workshops on various topics" },
    { number: "6", label: "Inter School Math Festivals" },
    { number: "20k+", label: "People impacted" },
  ];

  const objectives = [
    {
      title: "Problem Solving",
      description: "Develop your math skills through challenging problems and real-world applications. Build critical thinking and problem-solving abilities.",
      icon: <Calculator className="w-8 h-8" />,
      color: "text-purple-400"
    },
    {
      title: "Olympiad Preparation",
      description: "Preparing for math Olympiads helps you think outside the box and tackle advanced problems with confidence.",
      icon: <Trophy className="w-8 h-8" />,
      color: "text-amber-400"
    },
    {
      title: "Creativity",
      description: "Learn how creativity fuels problem-solving. Apply mathematical thinking in innovative ways.",
      icon: <Lightbulb className="w-8 h-8" />,
      color: "text-emerald-400"
    },
    {
      title: "Love for Math",
      description: "Embrace your passion for mathematics and explore its beauty in a supportive environment.",
      icon: <Heart className="w-8 h-8" />,
      color: "text-rose-400"
    }
  ];

  return (
    <div className="min-h-screen relative py-24 overflow-hidden">
      {/* Background Mathematical Graphic */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl aspect-square pointer-events-none opacity-10 z-0">
        <div className="absolute inset-0 border border-amber-500/30 rounded-full animate-[spin_60s_linear_infinite]" />
        <div className="absolute inset-12 border border-amber-500/20 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
        <div className="absolute inset-24 border border-amber-500/10 rounded-full animate-[spin_30s_linear_infinite]" />
        
        {/* Mathematical Symbols scattered */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 text-4xl text-amber-500 font-serif">α</div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-4xl text-amber-500 font-serif">β</div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 text-4xl text-amber-500 font-serif">Σ</div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-4xl text-amber-500 font-serif">π</div>
        <div className="absolute top-1/4 left-1/4 text-3xl text-amber-500 font-serif">∫</div>
        <div className="absolute bottom-1/4 right-1/4 text-3xl text-amber-500 font-serif">√</div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* What is JMC Section */}
        <section className="text-center mb-32">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold text-white mb-12 font-display tracking-widest uppercase"
          >
            What is <span className="gold-text">JMC?</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 max-w-4xl mx-auto text-lg md:text-xl leading-relaxed mb-16 font-light"
          >
            The Josephite Math Club is dedicated to cultivating a passion for mathematics. Our mission is to provide a supportive environment for students to explore mathematical concepts, participate in competitions, and engage in math-related events. Join us to experience the world of mathematics in a whole new way!
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-8 flex flex-col items-center justify-center border-white/5 hover:border-amber-500/30 transition-all group"
              >
                <span className="text-5xl font-bold text-white mb-4 font-display group-hover:scale-110 transition-transform duration-500">
                  {stat.number}
                </span>
                <span className="text-zinc-500 text-sm font-medium uppercase tracking-wider text-center">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Our Objectives Section */}
        <section className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold text-white mb-20 font-display tracking-widest uppercase"
          >
            Our <span className="gold-text">Objectives</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {objectives.map((obj, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-10 flex flex-col items-center text-center border-white/5 hover:bg-white/5 transition-all group relative overflow-hidden"
              >
                {/* Top accent line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className={`mb-8 p-4 rounded-2xl bg-white/5 ${obj.color} group-hover:scale-110 transition-transform duration-500`}>
                  {obj.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-6 font-display border-b border-white/10 pb-4 w-full">
                  {obj.title}
                </h3>
                
                <p className="text-zinc-400 text-sm leading-relaxed font-light">
                  {obj.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
