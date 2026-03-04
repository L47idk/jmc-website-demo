"use client";
import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface DashboardSectionProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({ 
  title, 
  description, 
  icon: Icon, 
  children,
  actions
}) => (
  <motion.section 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card p-10 border-white/5 relative overflow-hidden group/section"
  >
    {/* Background Glow */}
    <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/5 blur-[100px] rounded-full group-hover/section:bg-amber-500/10 transition-colors duration-700 pointer-events-none" />
    
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 relative z-10">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/10 shadow-lg shadow-amber-500/5">
          <Icon className="w-6 h-6 text-amber-500" />
        </div>
        <div className="space-y-1">
          <h3 className="text-2xl font-bold text-white font-display tracking-tight">{title}</h3>
          {description && (
            <p className="text-sm text-zinc-500 font-medium leading-relaxed max-w-xl">
              {description}
            </p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-3">
          {actions}
        </div>
      )}
    </div>
    
    <div className="relative z-10 space-y-8">
      {children}
    </div>
  </motion.section>
);
