"use client";
import React from 'react';

interface DashboardFormFieldProps {
  label: string;
  description?: string;
  children: React.ReactNode;
  error?: string;
}

export const DashboardFormField: React.FC<DashboardFormFieldProps> = ({ 
  label, 
  description, 
  children,
  error
}) => (
  <div className="space-y-2 group">
    <div className="flex flex-col">
      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest group-hover:text-amber-500 transition-colors">
        {label}
      </label>
      {description && (
        <p className="text-[10px] text-zinc-500 font-medium leading-relaxed mt-1">
          {description}
        </p>
      )}
    </div>
    <div className="relative">
      {children}
      {error && (
        <p className="text-[10px] text-red-500 font-bold mt-1 uppercase tracking-wider">
          {error}
        </p>
      )}
    </div>
  </div>
);
