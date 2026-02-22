"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const SplashScreen = ({ isLoaded, onFinish }: { isLoaded: boolean, onFinish: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90 && !isLoaded) return 90;
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onFinish, 500);
          return 100;
        }
        return prev + (isLoaded ? 5 : 2);
      });
    }, 30);

    return () => clearInterval(timer);
  }, [isLoaded, onFinish]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center"
    >
      <div className="w-64 space-y-6">
        <div className="relative h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-400 to-amber-600 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
          />
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-amber-500/60 text-xs font-bold tracking-[0.3em] uppercase"
        >
          Initializing Mathematical Sanctuary...
        </motion.p>
      </div>
    </motion.div>
  );
};

export default SplashScreen;
