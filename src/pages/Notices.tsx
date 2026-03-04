"use client";
import React from 'react';
import { useContent } from '../context/ContentContext';
import { motion } from 'motion/react';
import { Calendar, Bell, ExternalLink, FileText } from 'lucide-react';

const Notices = () => {
  const { content } = useContent();
  const notices = content?.notices || [];

  return (
    <div className="min-h-screen py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-bold text-white mb-6 font-display tracking-tighter"
          >
            Notice <span className="gold-text">Board</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-zinc-400 max-w-2xl mx-auto font-light"
          >
            Stay updated with the latest announcements, events, and important information from the Josephite Math Club.
          </motion.p>
        </div>

        {notices.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32 glass-card border-white/10"
          >
            <Bell className="w-20 h-20 text-zinc-800 mx-auto mb-8 animate-pulse" />
            <h3 className="text-3xl font-bold text-zinc-500 font-display">No notices at the moment</h3>
            <p className="text-zinc-600 mt-4 text-lg">Check back later for club updates.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {notices.map((notice: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
                className="glass-card group hover:border-amber-500/30 transition-all duration-500 overflow-hidden flex flex-col"
              >
                {notice.imageUrl && (
                  <div className="aspect-[16/10] overflow-hidden relative">
                    {notice.imageUrl.toLowerCase().endsWith('.pdf') ? (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900/50 group-hover:bg-zinc-900/80 transition-colors duration-500">
                        <FileText className="w-16 h-16 text-amber-500 mb-4 group-hover:scale-110 transition-transform duration-500" />
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">PDF Document</span>
                      </div>
                    ) : (
                      <img
                        src={notice.imageUrl}
                        alt={notice.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </div>
                )}
                <div className="p-10 flex-grow flex flex-col">
                  <div className="flex items-center gap-3 text-amber-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
                    <Calendar className="w-4 h-4" />
                    {notice.date || new Date().toLocaleDateString()}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-amber-400 transition-colors duration-500 font-display leading-tight">
                    {notice.title}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-8 flex-grow font-light">
                    {notice.description}
                  </p>
                  {(notice.link || (notice.imageUrl && notice.imageUrl.toLowerCase().endsWith('.pdf'))) && (
                    <a
                      href={notice.link || notice.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 font-bold text-xs uppercase tracking-widest transition-all duration-500 mt-auto group/link"
                    >
                      {notice.imageUrl?.toLowerCase().endsWith('.pdf') ? 'View PDF' : 'Learn More'} 
                      <ExternalLink className="w-4 h-4 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notices;
