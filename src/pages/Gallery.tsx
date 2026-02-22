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
          <h1 className="text-5xl font-bold text-white mb-6 font-display">Visual Archive</h1>
          <p className="text-xl text-zinc-400">Moments from our club events, workshops, and competitions.</p>
        </div>

        {images.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {images.map((img: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group relative aspect-[4/3] rounded-3xl overflow-hidden glass border-white/10 cursor-pointer"
              >
                <img
                  src={img.url}
                  alt={img.caption}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-8">
                  <p className="text-white text-lg font-bold font-display translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{img.caption}</p>
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
