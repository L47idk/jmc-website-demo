"use client";
import React from 'react';
import { useContent } from '../context/ContentContext';
import { motion } from 'motion/react';
import { Calendar, Bell, ExternalLink } from 'lucide-react';

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
            className="text-5xl md:text-7xl font-bold text-white mb-6 font-display tracking-tight"
          >
            Notice <span className="text-amber-500">Board</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-zinc-400 max-w-2xl mx-auto"
          >
            Stay updated with the latest announcements, events, and important information from the Josephite Math Club.
          </motion.p>
        </div>

        {notices.length === 0 ? (
          <div className="text-center py-20 glass-card">
            <Bell className="w-16 h-16 text-zinc-700 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-zinc-500">No notices at the moment</h3>
            <p className="text-zinc-600 mt-2">Check back later for updates.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {notices.map((notice: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card group hover:border-amber-500/30 transition-all overflow-hidden flex flex-col"
              >
                {notice.imageUrl && (
                  <div className="aspect-video overflow-hidden relative">
                    <img
                      src={notice.imageUrl}
                      alt={notice.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                )}
                <div className="p-8 flex-grow flex flex-col">
                  <div className="flex items-center gap-2 text-amber-500 text-xs font-bold uppercase tracking-widest mb-4">
                    <Calendar className="w-3 h-3" />
                    {notice.date || new Date().toLocaleDateString()}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-amber-400 transition-colors">
                    {notice.title}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-6 flex-grow">
                    {notice.description}
                  </p>
                  {notice.link && (
                    <a
                      href={notice.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 font-bold text-sm transition-colors mt-auto"
                    >
                      Learn More <ExternalLink className="w-4 h-4" />
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
