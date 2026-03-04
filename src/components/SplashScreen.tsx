"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const SplashScreen = ({ isLoaded, logoUrl, onFinish }: { isLoaded: boolean, logoUrl?: string, onFinish: () => void }) => {
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
      className="fixed inset-0 z-[100] bg-[#030303] flex flex-col items-center justify-center"
    >
      <div className="w-80 space-y-8">
        <div className="flex justify-center mb-4">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="h-16 w-48 relative"
          >
            <img 
              src={logoUrl || "/images/logo.png"} 
              alt="JMC Logo" 
              className="h-full w-full object-contain"
            />
          </motion.div>
        </div>
        <div className="relative h-2.5 w-full bg-white/[0.08] rounded-full p-[2px] border border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.5)]"
          />
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-amber-500/40 text-[10px] font-bold tracking-[0.5em] uppercase"
        >
          {progress < 100 ? "Initializing mathematical sanctuary..." : "Welcome to the Sanctuary"}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default SplashScreen;
