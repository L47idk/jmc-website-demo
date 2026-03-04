"use client";
import React, { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Calculator, Brain, Users, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import Link from 'next/link';

const Home = () => {
  const { content, loading } = useContent();
  const [currentIndex, setCurrentIndex] = useState(0);

  const gallery = content.gallery && content.gallery.filter((img: string) => img.trim() !== "").length > 0 
    ? content.gallery.filter((img: string) => img.trim() !== "")
    : [
        "images/gallery1.jpg",
        "images/gallery2.jpg",
        "images/gallery3.jpg",
        "images/gallery4.jpg",
        "images/gallery5.jpg",
        "images/gallery6.jpg",
      ];

  useEffect(() => {
    if (gallery.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % gallery.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [gallery.length]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-zinc-400">Loading...</div>;

  const { home } = content;

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % gallery.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + gallery.length) % gallery.length);
  };

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section id="hero" className="relative py-32 overflow-hidden">
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
                <span key={i} className={i === (home?.heroTitle?.split(' ').length ?? 0) - 1 ? "gold-text block md:inline" : "block md:inline mr-4"}>
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

      {/* Memories Section */}
      <section id="memories" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl font-bold tracking-tighter text-white font-display"
            >
              Our <span className="gold-text">Memories</span>
            </motion.h2>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-full max-w-5xl mx-auto aspect-video rounded-3xl overflow-hidden glass-card border-white/10 group"
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={gallery[currentIndex]}
                alt={`Memory ${currentIndex + 1}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-amber-500 hover:text-black transition-all opacity-0 group-hover:opacity-100 backdrop-blur-md border border-white/10"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-amber-500 hover:text-black transition-all opacity-0 group-hover:opacity-100 backdrop-blur-md border border-white/10"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
              {gallery.map((_: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx === currentIndex ? 'bg-amber-500 scale-125' : 'bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section (People About JMC) */}
      <section id="testimonials" className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl font-bold tracking-tighter text-white font-display"
            >
              {home?.testimonialsTitle?.split(' ').map((word: string, i: number, arr: string[]) => (
                <span key={i} className={i === arr.length - 1 ? "gold-text" : "mr-4"}>
                  {word}
                </span>
              )) || (
                <>People About <span className="gold-text">JMC</span></>
              )}
            </motion.h2>
          </div>
        </div>

        <div className="relative flex overflow-hidden group py-12 -my-12">
          {/* Gradient Masks */}
          <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />

          <div
            className="flex gap-8 w-max px-4 animate-marquee marquee-pause"
          >
            {/* Double the items for seamless loop */}
            {[...(home?.testimonials || []), ...(home?.testimonials || [])].map((t: any, i: number) => (
              <motion.div
                key={i}
                whileHover={{ 
                  y: -12, 
                  scale: 1.03,
                  borderColor: "rgba(245, 158, 11, 0.4)",
                  boxShadow: "0 20px 40px -10px rgba(245, 158, 11, 0.15)",
                  zIndex: 50
                }}
                className="w-[450px] shrink-0 glass-card p-8 border-white/10 transition-all duration-500 group/card relative overflow-hidden"
              >
                {/* Subtle Glow Effect */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/5 blur-[80px] group-hover/card:bg-amber-500/15 transition-colors" />
                
                <div className="flex items-start justify-between mb-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-500/20 bg-zinc-900 shrink-0">
                      {t.imageUrl ? (
                        <img src={t.imageUrl} alt={t.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                          <Users className="w-8 h-8 text-zinc-600" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-lg font-bold text-white truncate">{t.name}</h4>
                      <p className="text-xs font-bold text-amber-500 uppercase tracking-widest">{t.role}</p>
                    </div>
                  </div>
                  <Quote className="w-8 h-8 text-amber-500/20 group-hover/card:text-amber-500/40 transition-colors" />
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed whitespace-normal line-clamp-6 italic font-light relative z-10">
                  "{t.message}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
