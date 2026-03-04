"use client";
import React from 'react';
import { useContent } from '../context/ContentContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { User, Shield, Star, Briefcase, Users, Award, Upload, Loader2 } from 'lucide-react';
import Image from 'next/image';

// --- COMPONENTS ---

const Flashcard = ({ role, name, imageUrl, icon: Icon = User, onUpload, isAdmin }: any) => {
  const [uploading, setUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAdmin) return;
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      
      if (onUpload) {
        await onUpload(data.url);
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      className="glass-card overflow-hidden transition-all duration-500 group relative flex flex-col border-white/5 bg-[#0a0a0c]/80"
    >
      <div className="aspect-[4/5] relative overflow-hidden bg-zinc-900/50">
        {imageUrl ? (
          <Image 
            src={imageUrl} 
            alt={name || 'Member'} 
            fill 
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-amber-500/10">
            <Icon className="w-24 h-24" />
          </div>
        )}
        
        {/* Upload Overlay - Only for Admins */}
        {isAdmin && (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-20 backdrop-blur-sm"
          >
            {uploading ? (
              <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-6 h-6 text-white" />
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Update Photo</span>
              </div>
            )}
          </div>
        )}
        {isAdmin && (
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleUpload} 
            className="hidden" 
            accept=".jpg,.jpeg,.png"
          />
        )}
      </div>
      <div className="p-6 bg-gradient-to-b from-transparent to-black/40 backdrop-blur-md border-t border-white/5 text-center">
        <p className="font-bold text-white font-display tracking-tight text-lg leading-tight mb-1 group-hover:text-amber-500 transition-colors">
          {name || 'New Member'}
        </p>
        <p className="text-indigo-400 text-[10px] uppercase tracking-[0.2em] font-bold">
          {role || 'Member'}
        </p>
      </div>
    </motion.div>
  );
};

const SectionHeading = ({ children, subtitle }: any) => (
  <div className="mb-16 text-center">
    <motion.h2 
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="text-4xl md:text-7xl font-bold text-white font-display tracking-tighter mb-4 uppercase"
    >
      {children}
    </motion.h2>
    {subtitle && <p className="text-zinc-500 font-light text-lg tracking-widest uppercase">{subtitle}</p>}
    <motion.div 
      initial={{ width: 0 }}
      whileInView={{ width: 100 }}
      viewport={{ once: true }}
      className="h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-8 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.5)]"
    ></motion.div>
  </div>
);

const SubHeading = ({ children }: any) => (
  <h3 className="text-xl font-bold text-amber-500 font-display mb-8 uppercase tracking-widest text-center">
    {children}
  </h3>
);

const Panel = () => {
  const { content, loading } = useContent();
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = React.useState('current');

  if (loading) return null; // Root layout handles splash screen

  const panel = content.panel;
  if (!panel) return null;

  const activePanelData = panel.executive?.[activeTab] || {};

  const handleMemberUpdate = async (jsonPath: string, value: any) => {
    try {
      const res = await fetch('/api/content/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonPath, value }),
      });
      if (res.ok) {
        // Refresh page to show new content
        window.location.reload();
      }
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  return (
    <div className="min-h-screen py-32 px-4 sm:px-6 lg:px-8 bg-[#050505]">
      <div className="max-w-7xl mx-auto space-y-32">
        
        {/* --- MODERATORS SECTION --- */}
        <section>
          <SectionHeading>Moderators</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {panel.moderators?.map((m: any, i: number) => (
              <Flashcard 
                key={i} 
                {...m} 
                isBig 
                icon={Shield} 
                isAdmin={isAdmin}
                onUpload={(url: string) => handleMemberUpdate(`panel.moderators.${i}.imageUrl`, url)}
              />
            ))}
          </div>
        </section>

        {/* --- EXECUTIVE COMMITTEE SECTION --- */}
        <section className="space-y-20">
          <SectionHeading subtitle="The Core Leadership">Executive Committee</SectionHeading>
          
          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-16">
            {['current', 'recent', 'former'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-xl font-bold uppercase tracking-widest transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                    : 'bg-white/5 text-zinc-500 hover:bg-white/10 hover:text-white border border-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-16"
          >
            <div>
              <SubHeading>President</SubHeading>
              <div className="flex justify-center">
                <div className="w-full max-w-md">
                  {activePanelData.president?.map((p: any, i: number) => (
                    <Flashcard 
                      key={i} 
                      {...p} 
                      icon={Star} 
                      isBig 
                      isAdmin={isAdmin}
                      onUpload={(url: string) => handleMemberUpdate(`panel.executive.${activeTab}.president.${i}.imageUrl`, url)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <SubHeading>Deputy Presidents</SubHeading>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {activePanelData.deputyPresidents?.map((p: any, i: number) => (
                  <Flashcard 
                    key={i} 
                    {...p} 
                    icon={Award} 
                    isAdmin={isAdmin}
                    onUpload={(url: string) => handleMemberUpdate(`panel.executive.${activeTab}.deputyPresidents.${i}.imageUrl`, url)}
                  />
                ))}
              </div>
            </div>

            <div>
              <SubHeading>General Secretary</SubHeading>
              <div className="flex justify-center">
                <div className="w-full max-w-md">
                  {activePanelData.generalSecretary?.map((p: any, i: number) => (
                    <Flashcard 
                      key={i} 
                      {...p} 
                      icon={Briefcase} 
                      isAdmin={isAdmin}
                      onUpload={(url: string) => handleMemberUpdate(`panel.executive.${activeTab}.generalSecretary.${i}.imageUrl`, url)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <SubHeading>Vice Presidents</SubHeading>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                {activePanelData.vicePresidents?.map((p: any, i: number) => (
                  <Flashcard 
                    key={i} 
                    {...p} 
                    isAdmin={isAdmin}
                    onUpload={(url: string) => handleMemberUpdate(`panel.executive.${activeTab}.vicePresidents.${i}.imageUrl`, url)}
                  />
                ))}
              </div>
            </div>
          </motion.div>
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
              {activePanelData.departments?.map((d: any, i: number) => (
                <div key={i} className="glass-card p-6 border-white/5 flex flex-col items-center text-center group hover:bg-white/5 transition-all relative">
                  <p className="text-amber-500 font-bold text-xs mb-2 uppercase tracking-tighter">{d.dept}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden relative group/img">
                      {d.imageUrl ? (
                        <Image src={d.imageUrl} alt={d.name || 'Dept Head'} fill className="object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <User className="w-4 h-4 text-zinc-500" />
                      )}
                      
                      {/* Mini Upload Overlay - Only for Admins */}
                      {isAdmin && (
                        <div 
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = '.jpg,.jpeg,.png';
                            input.onchange = async (e: any) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const formData = new FormData();
                              formData.append('file', file);
                              const res = await fetch('/api/upload', { method: 'POST', body: formData });
                              if (res.ok) {
                                const data = await res.json();
                                handleMemberUpdate(`panel.executive.${activeTab}.departments.${i}.imageUrl`, data.url);
                              }
                            };
                            input.click();
                          }}
                          className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer z-10"
                        >
                          <Upload className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-white font-medium text-sm">{d.name || 'Head Name'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- SECRETARY POSITIONS SECTION --- */}
        <section className="space-y-12">
          <SectionHeading>Secretary Positions</SectionHeading>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { id: 'asstGeneralSecretary', label: 'Asst. General Secretary' },
              { id: 'jointSecretary', label: 'Joint Secretary' },
              { id: 'organizingSecretary', label: 'Organizing Secretary' },
              { id: 'correspondingSecretary', label: 'Corresponding Secretary' }
            ].map((category) => (
              <div key={category.id} className="glass-card border-white/10 overflow-hidden flex flex-col h-full">
                <div className="bg-white/10 p-5 border-b border-white/10">
                  <h4 className="text-white font-bold font-display uppercase tracking-widest text-sm">{category.label}</h4>
                </div>
                <div className="p-5 space-y-3 flex-1 bg-black/20">
                  {activePanelData.secretaries?.[category.id]?.map((s: any, i: number) => (
                    <div key={i} className="flex items-center gap-4 p-3 bg-white/[0.03] rounded-xl border border-white/5 hover:bg-white/10 transition-all group/sec cursor-default">
                      <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden relative group/img shrink-0 border border-white/10">
                        {s.imageUrl ? (
                          <Image src={s.imageUrl} alt={s.name || 'Secretary'} fill className="object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <User className="w-5 h-5 text-zinc-500" />
                        )}
                        {isAdmin && (
                          <div 
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = '.jpg,.jpeg,.png';
                              input.onchange = async (e: any) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const formData = new FormData();
                                formData.append('file', file);
                                const res = await fetch('/api/upload', { method: 'POST', body: formData });
                                if (res.ok) {
                                  const data = await res.json();
                                  handleMemberUpdate(`panel.executive.${activeTab}.secretaries.${category.id}.${i}.imageUrl`, data.url);
                                }
                              };
                              input.click();
                            }}
                            className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer z-10"
                          >
                            <Upload className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-zinc-200 text-sm font-bold tracking-tight">{s.name || 'Secretary Name'}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Panel;
