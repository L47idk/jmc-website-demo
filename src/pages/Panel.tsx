"use client";
import React from 'react';
import { motion } from 'motion/react';
import { User, Shield, Star, Briefcase, Users, Award } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import Image from 'next/image';

// --- COMPONENTS ---

const Flashcard = ({ role, name, imageUrl, isBig = false, icon: Icon = User }: any) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
    className={`glass-card flex items-center gap-4 transition-all duration-300 ${
      isBig ? 'p-8 border-amber-500/30' : 'p-4 border-white/5'
    }`}
  >
    <div className={`rounded-full flex items-center justify-center bg-amber-500/10 text-amber-500 shrink-0 overflow-hidden relative ${
      isBig ? 'w-16 h-16' : 'w-10 h-10'
    }`}>
      {imageUrl ? (
        <Image 
          src={imageUrl} 
          alt={name} 
          fill 
          className="object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <Icon className={isBig ? 'w-8 h-8' : 'w-5 h-5'} />
        </motion.div>
      )}
    </div>
    <div className="min-w-0">
      <p className={`font-bold text-white font-display truncate ${isBig ? 'text-xl' : 'text-sm'}`}>{role || name}</p>
      {role && name && <p className="text-zinc-500 text-[10px] mt-1 uppercase tracking-widest truncate">{name}</p>}
      {!role && name && <p className="text-zinc-500 text-[10px] mt-1 uppercase tracking-widest">Member</p>}
    </div>
  </motion.div>
);

const SectionHeading = ({ children, subtitle }: any) => (
  <div className="mb-12 text-center">
    <h2 className="text-3xl md:text-5xl font-bold text-white font-display tracking-tight mb-4 uppercase">
      {children}
    </h2>
    {subtitle && <p className="text-zinc-500 font-mono text-sm tracking-widest uppercase">{subtitle}</p>}
    <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto mt-6 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>
  </div>
);

const SubHeading = ({ children }: any) => (
  <h3 className="text-xl font-bold text-amber-500 font-display mb-8 uppercase tracking-widest text-center">
    {children}
  </h3>
);

const Panel = () => {
  const { content, loading } = useContent();

  if (loading) return null; // Root layout handles splash screen

  const { panel } = content;
  if (!panel) return null;

  return (
    <div className="min-h-screen py-32 px-4 sm:px-6 lg:px-8 bg-[#050505]">
      <div className="max-w-7xl mx-auto space-y-32">
        
        {/* --- MODERATORS SECTION --- */}
        <section>
          <SectionHeading>Moderators</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {panel.moderators?.map((m: any, i: number) => (
              <Flashcard key={i} {...m} isBig icon={Shield} />
            ))}
          </div>
        </section>

        {/* --- EXECUTIVE COMMITTEE SECTION --- */}
        <section className="space-y-20">
          <SectionHeading subtitle="The Core Leadership">Executive Committee</SectionHeading>
          
          <div className="space-y-16">
            <div>
              <SubHeading>President</SubHeading>
              <div className="flex justify-center">
                <div className="w-full max-w-md">
                  {panel.executive?.president?.map((p: any, i: number) => (
                    <Flashcard key={i} {...p} icon={Star} isBig />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <SubHeading>Deputy Presidents</SubHeading>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {panel.executive?.deputyPresidents?.map((p: any, i: number) => (
                  <Flashcard key={i} {...p} icon={Award} />
                ))}
              </div>
            </div>

            <div>
              <SubHeading>General Secretary</SubHeading>
              <div className="flex justify-center">
                <div className="w-full max-w-md">
                  {panel.executive?.generalSecretary?.map((p: any, i: number) => (
                    <Flashcard key={i} {...p} icon={Briefcase} />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <SubHeading>Vice Presidents</SubHeading>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {panel.executive?.vicePresidents?.map((p: any, i: number) => (
                  <Flashcard key={i} {...p} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* --- DEPARTMENT LEADERSHIP SECTION --- */}
        <section className="space-y-12">
          <SectionHeading>Department Leadership</SectionHeading>
          
          <div className="glass-card p-1 border-amber-500/20 overflow-hidden">
            <div className="bg-amber-500/10 p-6 flex items-center gap-4 border-b border-amber-500/20">
              <motion.div
                animate={{ 
                  scale: [1, 1.15, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                <Users className="w-6 h-6 text-amber-500" />
              </motion.div>
              <h3 className="text-xl font-bold text-white font-display uppercase tracking-widest">Department Heads</h3>
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/40">
              {panel.departments?.map((d: any, i: number) => (
                <div key={i} className="glass-card p-6 border-white/5 flex flex-col items-center text-center group hover:bg-white/5 transition-all">
                  <p className="text-amber-500 font-bold text-xs mb-2 uppercase tracking-tighter">{d.dept}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden relative">
                      {d.imageUrl ? (
                        <Image src={d.imageUrl} alt={d.name} fill className="object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <User className="w-4 h-4 text-zinc-500" />
                      )}
                    </div>
                    <p className="text-white font-medium text-sm">{d.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- SECRETARY POSITIONS SECTION --- */}
        <section className="space-y-12">
          <SectionHeading>Secretary Positions</SectionHeading>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Asst. General Secretary */}
            <div className="glass-card border-white/10 overflow-hidden">
              <div className="bg-white/5 p-4 border-b border-white/10">
                <h4 className="text-white font-bold font-display uppercase tracking-widest text-sm">Asst. General Secretary</h4>
              </div>
              <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
                {panel.secretaries?.asstGeneralSecretary?.map((s: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden relative">
                      {s.imageUrl ? (
                        <Image src={s.imageUrl} alt={s.name} fill className="object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <User className="w-4 h-4 text-zinc-500" />
                      )}
                    </div>
                    <p className="text-zinc-300 text-sm font-medium">{s.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Joint Secretary */}
            <div className="glass-card border-white/10 overflow-hidden">
              <div className="bg-white/5 p-4 border-b border-white/10">
                <h4 className="text-white font-bold font-display uppercase tracking-widest text-sm">Joint Secretary</h4>
              </div>
              <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
                {panel.secretaries?.jointSecretary?.map((s: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden relative">
                      {s.imageUrl ? (
                        <Image src={s.imageUrl} alt={s.name} fill className="object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <User className="w-4 h-4 text-zinc-500" />
                      )}
                    </div>
                    <p className="text-zinc-300 text-sm font-medium">{s.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Organizing Secretary */}
            <div className="glass-card border-white/10 overflow-hidden">
              <div className="bg-white/5 p-4 border-b border-white/10">
                <h4 className="text-white font-bold font-display uppercase tracking-widest text-sm">Organizing Secretary</h4>
              </div>
              <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                {panel.secretaries?.organizingSecretary?.map((s: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden relative">
                      {s.imageUrl ? (
                        <Image src={s.imageUrl} alt={s.name} fill className="object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <User className="w-4 h-4 text-zinc-500" />
                      )}
                    </div>
                    <p className="text-zinc-300 text-sm font-medium">{s.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Corresponding Secretary */}
            <div className="glass-card border-white/10 overflow-hidden">
              <div className="bg-white/5 p-4 border-b border-white/10">
                <h4 className="text-white font-bold font-display uppercase tracking-widest text-sm">Corresponding Secretary</h4>
              </div>
              <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                {panel.secretaries?.correspondingSecretary?.map((s: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden relative">
                      {s.imageUrl ? (
                        <Image src={s.imageUrl} alt={s.name} fill className="object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <User className="w-4 h-4 text-zinc-500" />
                      )}
                    </div>
                    <p className="text-zinc-300 text-sm font-medium">{s.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Panel;
