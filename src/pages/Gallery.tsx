"use client";
import React from 'react';
import { motion } from 'motion/react';

import { useContent } from '../context/ContentContext';

const Gallery = () => {
  const { content, loading } = useContent();

  if (loading) return null;

  const images = content.gallery || [];

  return (
    <div className="min-h-screen relative py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-bold text-white mb-6 font-display tracking-tighter"
          >
            Visual <span className="gold-text">Archive</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-zinc-400 font-light"
          >
            Moments from our club events, workshops, and competitions.
          </motion.p>
        </div>

        {images.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {images.map((img: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
                className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden glass-card border-white/10 cursor-pointer"
              >
                <img
                  src={img.url}
                  alt={img.caption}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-end p-10">
                  <div className="translate-y-6 group-hover:translate-y-0 transition-transform duration-700">
                    <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-2">Event Gallery</p>
                    <p className="text-white text-2xl font-bold font-display">{img.caption}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-zinc-500 italic">No images in the archive yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
