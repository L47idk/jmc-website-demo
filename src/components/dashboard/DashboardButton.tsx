"use client";
import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface DashboardButtonProps {
  onClick: (e: React.MouseEvent) => void;
  icon?: LucideIcon;
  label: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export const DashboardButton: React.FC<DashboardButtonProps> = ({ 
  onClick, 
  icon: Icon, 
  label, 
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false
}) => {
  const variants = {
    primary: 'bg-amber-500 text-black hover:bg-amber-400 shadow-lg shadow-amber-500/10',
    secondary: 'bg-white/5 text-white hover:bg-white/10 border border-white/5',
    danger: 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/10',
    ghost: 'bg-transparent text-zinc-500 hover:text-white hover:bg-white/5'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-[10px]',
    md: 'px-5 py-2.5 text-[11px]',
    lg: 'px-8 py-4 text-sm'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center justify-center gap-2 rounded-xl font-bold uppercase tracking-widest transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {Icon && <Icon className={`${size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />}
      {label}
    </motion.button>
  );
};
