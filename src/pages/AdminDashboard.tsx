"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Settings, 
  Home, 
  Info, 
  Image as ImageIcon, 
  Users, 
  Bell, 
  UserCheck,
  ShieldAlert,
  Plus,
  Trash2,
  Star,
  Layout,
  Edit3,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { produce } from 'immer';
import { motion, AnimatePresence } from 'motion/react';

import { useDashboard } from '../hooks/useDashboard';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { DashboardSection } from '../components/dashboard/DashboardSection';
import { DashboardFormField } from '../components/dashboard/DashboardFormField';
import { DashboardFileUpload } from '../components/dashboard/DashboardFileUpload';
import { DashboardButton } from '../components/dashboard/DashboardButton';
import { UserManagement } from '../components/dashboard/UserManagement';

const AdminDashboard = () => {
  const {
    isAdmin,
    authLoading,
    localContent,
    setLocalContent,
    saving,
    saveSuccess,
    uploading,
    handleSave,
    handleFileUpload,
    handleDeleteFile,
    updateFieldByPath,
    resetLocalContent,
    isSupabaseConfigured
  } = useDashboard();

  // Debug: Log localContent changes
  React.useEffect(() => {
    if (localContent) {
      console.log("AdminDashboard: localContent updated", localContent);
    }
  }, [localContent]);

  const [activeTab, setActiveTab] = useState('site');
  const [activeExecTab, setActiveExecTab] = useState('current');

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto shadow-2xl shadow-amber-500/20"></div>
          <div className="space-y-2">
            <p className="text-white font-bold text-xl tracking-tight">Authenticating</p>
            <p className="text-zinc-500 text-sm font-medium">Verifying your administrative credentials...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md p-12 glass-card border-red-500/20 relative overflow-hidden"
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-500/5 blur-[100px] rounded-full" />
          <ShieldAlert className="w-20 h-20 text-red-500 mx-auto mb-8 relative z-10" />
          <h1 className="text-4xl font-bold text-white font-display mb-4 tracking-tight relative z-10">Access Denied</h1>
          <p className="text-zinc-400 leading-relaxed mb-8 relative z-10">You do not have administrative privileges to access this area. Please contact the system administrator if you believe this is an error.</p>
          <DashboardButton 
            onClick={() => window.location.href = '/'}
            label="Return to Safety"
            variant="secondary"
            className="w-full relative z-10"
          />
        </motion.div>
      </div>
    );
  }

  if (!localContent) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em]">Loading Content...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'site', label: 'General', icon: Settings },
    { id: 'home', label: 'Home Page', icon: Home },
    { id: 'about', label: 'About Us', icon: Info },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'panel', label: 'Panel Members', icon: Users },
    { id: 'notices', label: 'Notice Board', icon: Bell },
    { id: 'users', label: 'User Access', icon: UserCheck },
  ];

  return (
    <DashboardLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onSave={handleSave}
      onReset={() => {
        if (window.confirm("Discard all unsaved changes and reset to server state?")) {
          resetLocalContent();
        }
      }}
      saving={saving}
      saveSuccess={saveSuccess}
      isSupabaseConfigured={isSupabaseConfigured}
      logoUrl={localContent.site.logoUrl}
      tabs={tabs}
    >
      {/* Site Settings */}
      {activeTab === 'site' && (
        <DashboardSection 
          title="General Settings" 
          description="Configure the core identity and branding of the Josephite Math Club."
          icon={Settings}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <DashboardFormField label="Club Name" description="The primary name used across the website">
              <input
                type="text"
                value={localContent.site.clubName}
                onChange={(e) => updateFieldByPath(['site', 'clubName'], e.target.value)}
                className="w-full px-5 py-4 bg-black/20 border border-white/10 rounded-2xl text-white outline-none focus:border-amber-500/50 transition-all font-bold text-lg"
              />
            </DashboardFormField>

            <DashboardFileUpload
              label="Club Logo"
              description="Recommended: Transparent PNG, 200x200px"
              path={['site', 'logoUrl']}
              value={localContent.site.logoUrl}
              uploading={uploading === 'site-logoUrl'}
              onUpload={handleFileUpload}
              onDelete={handleDeleteFile}
              onChange={updateFieldByPath}
            />
          </div>
        </DashboardSection>
      )}

      {/* Home Page Settings */}
      {activeTab === 'home' && (
        <div className="space-y-12">
          <DashboardSection 
            title="Hero Section" 
            description="The first thing visitors see. Make it bold and impactful."
            icon={Layout}
          >
            <div className="space-y-8">
              <DashboardFormField label="Hero Title" description="Main headline on the home page">
                <input
                  type="text"
                  value={localContent.home.heroTitle}
                  onChange={(e) => updateFieldByPath(['home', 'heroTitle'], e.target.value)}
                  className="w-full px-6 py-5 bg-black/20 border border-white/10 rounded-2xl text-white outline-none focus:border-amber-500/50 transition-all font-bold text-3xl font-display"
                />
              </DashboardFormField>
              <DashboardFormField label="Hero Subtitle" description="Supporting text below the headline">
                <textarea
                  value={localContent.home.heroSubtitle}
                  onChange={(e) => updateFieldByPath(['home', 'heroSubtitle'], e.target.value)}
                  rows={3}
                  className="w-full px-6 py-5 bg-black/20 border border-white/10 rounded-2xl text-white outline-none focus:border-amber-500/50 transition-all text-lg leading-relaxed resize-none"
                />
              </DashboardFormField>
            </div>
          </DashboardSection>

          <DashboardSection 
            title="Testimonials" 
            description="Manage feedback and quotes from club members and leaders."
            icon={Star}
            actions={
              <DashboardButton 
                onClick={() => {
                  setLocalContent((state: any) => produce(state, (draft: any) => {
                    if (!draft.home.testimonials) draft.home.testimonials = [];
                    draft.home.testimonials.push({ 
                      id: `testimonial-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                      name: "", 
                      role: "", 
                      message: "", 
                      imageUrl: "" 
                    });
                  }));
                }}
                label="Add Message"
                icon={Plus}
                size="sm"
              />
            }
          >
            <div className="grid grid-cols-1 gap-8">
              {localContent.home.testimonials?.map((t: any, i: number) => (
                <div key={t.id} className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl relative group hover:border-amber-500/20 transition-all duration-500">
                  <button
                    onClick={(e) => {
                      console.log("Dashboard: Testimonial delete button clicked", t.id);
                      e.stopPropagation();
                      if (window.confirm('Delete this testimonial?')) {
                        console.log("Dashboard: Deleting testimonial", t.id);
                        setLocalContent((state: any) => produce(state, (draft: any) => {
                          if (draft?.home?.testimonials) {
                            const index = draft.home.testimonials.findIndex((item: any) => item.id === t.id);
                            if (index !== -1) {
                              draft.home.testimonials.splice(index, 1);
                              console.log("Dashboard: Testimonial removed from draft");
                            } else {
                              console.warn("Dashboard: Testimonial ID not found in draft", t.id);
                            }
                          }
                        }));
                      }
                    }}
                    className="absolute top-6 right-6 p-2.5 text-zinc-500 hover:text-red-500 transition-all bg-black/60 rounded-xl border border-white/10 z-[9999] pointer-events-auto shadow-xl"
                    title="Delete Testimonial"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <DashboardFormField label="Full Name">
                          <input
                            type="text"
                            value={t.name}
                            onChange={(e) => {
                              const val = e.target.value;
                              setLocalContent((state: any) => produce(state, (draft: any) => {
                                const item = draft.home.testimonials.find((it: any) => it.id === t.id);
                                if (item) item.name = val;
                              }));
                            }}
                            className="w-full px-5 py-3 bg-black/20 border border-white/10 rounded-xl text-white outline-none focus:border-amber-500/50 transition-all"
                          />
                        </DashboardFormField>
                        <DashboardFormField label="Role / Designation">
                          <input
                            type="text"
                            value={t.role}
                            onChange={(e) => {
                              const val = e.target.value;
                              setLocalContent((state: any) => produce(state, (draft: any) => {
                                const item = draft.home.testimonials.find((it: any) => it.id === t.id);
                                if (item) item.role = val;
                              }));
                            }}
                            className="w-full px-5 py-3 bg-black/20 border border-white/10 rounded-xl text-white outline-none focus:border-amber-500/50 transition-all"
                          />
                        </DashboardFormField>
                      </div>
                      <DashboardFormField label="Message Content">
                        <textarea
                          value={t.message}
                          onChange={(e) => {
                            const val = e.target.value;
                            setLocalContent((state: any) => produce(state, (draft: any) => {
                              const item = draft.home.testimonials.find((it: any) => it.id === t.id);
                              if (item) item.message = val;
                            }));
                          }}
                          rows={4}
                          className="w-full px-5 py-3 bg-black/20 border border-white/10 rounded-xl text-white outline-none focus:border-amber-500/50 transition-all resize-none"
                        />
                      </DashboardFormField>
                    </div>
                    <DashboardFileUpload
                      label="Portrait"
                      path={['home', 'testimonials', i, 'imageUrl']}
                      value={t.imageUrl}
                      uploading={uploading === `home-testimonials-${i}-imageUrl`}
                      onUpload={handleFileUpload}
                      onDelete={handleDeleteFile}
                      onChange={updateFieldByPath}
                    />
                  </div>
                </div>
              ))}
            </div>
          </DashboardSection>
        </div>
      )}

      {/* About Us Settings */}
      {activeTab === 'about' && (
        <DashboardSection 
          title="About Content" 
          description="Tell the story of the Josephite Math Club and its mission."
          icon={Info}
        >
          <div className="space-y-10">
            <DashboardFormField label="Page Title">
              <input
                type="text"
                value={localContent.about.title}
                onChange={(e) => updateFieldByPath(['about', 'title'], e.target.value)}
                className="w-full px-6 py-4 bg-black/20 border border-white/10 rounded-2xl text-white outline-none focus:border-amber-500/50 transition-all font-bold text-2xl"
              />
            </DashboardFormField>
            <DashboardFormField label="Our Story" description="A detailed description of the club's history and purpose">
              <textarea
                value={localContent.about.description}
                onChange={(e) => updateFieldByPath(['about', 'description'], e.target.value)}
                rows={6}
                className="w-full px-6 py-5 bg-black/20 border border-white/10 rounded-2xl text-white outline-none focus:border-amber-500/50 transition-all leading-relaxed resize-none"
              />
            </DashboardFormField>
            <DashboardFormField label="Our Mission" description="The core objective of the club">
              <textarea
                value={localContent.about.mission}
                onChange={(e) => updateFieldByPath(['about', 'mission'], e.target.value)}
                rows={3}
                className="w-full px-6 py-5 bg-black/20 border border-white/10 rounded-2xl text-white outline-none focus:border-amber-500/50 transition-all leading-relaxed resize-none"
              />
            </DashboardFormField>
          </div>
        </DashboardSection>
      )}

      {/* Gallery Settings */}
      {activeTab === 'gallery' && (
        <DashboardSection 
          title="Image Gallery" 
          description="Showcase the vibrant activities and events of the club."
          icon={ImageIcon}
          actions={
            <DashboardButton 
              onClick={() => {
                setLocalContent((state: any) => produce(state, (draft: any) => {
                  if (!draft.gallery) draft.gallery = [];
                  draft.gallery.push({ id: `gallery-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, url: "" });
                }));
              }}
              label="Add Image"
              icon={Plus}
              size="sm"
            />
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {localContent.gallery?.map((img: any, i: number) => (
              <div key={img.id} className="relative group">
                <DashboardFileUpload
                  path={['gallery', i, 'url']}
                  value={img.url}
                  uploading={uploading === `gallery-${i}-url`}
                  onUpload={handleFileUpload}
                  onDelete={handleDeleteFile}
                  onChange={updateFieldByPath}
                />
                <button
                  onClick={(e) => {
                    console.log("Dashboard: Gallery image delete button clicked", img.id);
                    e.stopPropagation();
                    if (window.confirm('Remove this image from gallery?')) {
                      console.log("Dashboard: Deleting gallery image", img.id);
                      setLocalContent((state: any) => produce(state, (draft: any) => {
                        if (draft?.gallery) {
                          const index = draft.gallery.findIndex((item: any) => item.id === img.id);
                          if (index !== -1) {
                            draft.gallery.splice(index, 1);
                            console.log("Dashboard: Image removed from draft");
                          } else {
                            console.warn("Dashboard: Image ID not found in draft", img.id);
                          }
                        }
                      }));
                    }
                  }}
                  className="absolute top-4 right-4 p-2.5 bg-red-500/20 text-red-500 rounded-xl transition-all hover:bg-red-500/40 border border-red-500/20 z-[9999] pointer-events-auto shadow-xl"
                  title="Remove from Gallery"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {localContent.gallery?.length === 0 && (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                <ImageIcon className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">No images in gallery</p>
              </div>
            )}
          </div>
        </DashboardSection>
      )}

      {/* Panel Members Settings */}
      {activeTab === 'panel' && (
        <div className="space-y-12">
          {/* Moderators Section */}
          <DashboardSection 
            title="Moderators" 
            description="The guiding faculty and mentors of the Josephite Math Club."
            icon={Users}
            actions={
              <DashboardButton 
                onClick={() => {
                  setLocalContent((state: any) => produce(state, (draft: any) => {
                    if (!draft.panel) draft.panel = {};
                    if (!draft.panel.moderators) draft.panel.moderators = [];
                    draft.panel.moderators.push({ 
                      id: `mod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                      role: "Moderator", 
                      name: "", 
                      imageUrl: "" 
                    });
                  }));
                }}
                label="Add Moderator"
                icon={Plus}
                size="sm"
              />
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {localContent.panel.moderators?.map((m: any, i: number) => (
                <div key={m.id} className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl relative group hover:border-amber-500/20 transition-all duration-500">
                  <button
                    onClick={(e) => {
                      console.log("Dashboard: Moderator delete button clicked", m.id);
                      e.stopPropagation();
                      if (window.confirm('Remove this moderator?')) {
                        console.log("Dashboard: Deleting moderator", m.id);
                        setLocalContent((state: any) => produce(state, (draft: any) => {
                          if (draft?.panel?.moderators) {
                            const index = draft.panel.moderators.findIndex((item: any) => item.id === m.id);
                            if (index !== -1) {
                              draft.panel.moderators.splice(index, 1);
                              console.log("Dashboard: Moderator removed from draft");
                            } else {
                              console.warn("Dashboard: Moderator ID not found in draft", m.id);
                            }
                          }
                        }));
                      }
                    }}
                    className="absolute top-6 right-6 p-2.5 text-zinc-500 hover:text-red-500 transition-all bg-black/60 rounded-xl border border-white/10 z-[9999] pointer-events-auto shadow-xl"
                    title="Remove Moderator"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 gap-6">
                      <DashboardFormField label="Role / Title">
                        <input
                          type="text"
                          value={m.role}
                          onChange={(e) => {
                            const val = e.target.value;
                            setLocalContent((state: any) => produce(state, (draft: any) => {
                              const item = draft.panel.moderators.find((it: any) => it.id === m.id);
                              if (item) item.role = val;
                            }));
                          }}
                          className="w-full px-5 py-3 bg-black/20 border border-white/10 rounded-xl text-white outline-none focus:border-amber-500/50 transition-all font-bold"
                        />
                      </DashboardFormField>
                      <DashboardFormField label="Full Name">
                        <input
                          type="text"
                          value={m.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            setLocalContent((state: any) => produce(state, (draft: any) => {
                              const item = draft.panel.moderators.find((it: any) => it.id === m.id);
                              if (item) item.name = val;
                            }));
                          }}
                          className="w-full px-5 py-3 bg-black/20 border border-white/10 rounded-xl text-white outline-none focus:border-amber-500/50 transition-all"
                        />
                      </DashboardFormField>
                    </div>
                    <DashboardFileUpload
                      label="Moderator Portrait"
                      path={['panel', 'moderators', i, 'imageUrl']}
                      value={m.imageUrl}
                      uploading={uploading === `panel-moderators-${i}-imageUrl`}
                      onUpload={handleFileUpload}
                      onDelete={handleDeleteFile}
                      onChange={updateFieldByPath}
                    />
                  </div>
                </div>
              ))}
            </div>
          </DashboardSection>

          {/* Executive Committee Section */}
          <DashboardSection 
            title="Executive Committee" 
            description="Manage the student leadership across different terms."
            icon={Users}
            actions={
              <div className="flex gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/5">
                {['current', 'recent', 'former'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveExecTab(tab)}
                    className={`px-6 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl transition-all ${
                      activeExecTab === tab 
                        ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' 
                        : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            }
          >
            <div className="space-y-16">
              {/* Top Tier: President & General Secretary */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                {/* President */}
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-500" />
                      <h4 className="text-sm font-bold text-white uppercase tracking-widest">President</h4>
                    </div>
                    <DashboardButton 
                      onClick={() => {
                        setLocalContent((state: any) => produce(state, (draft: any) => {
                          if (!draft.panel) draft.panel = {};
                          if (!draft.panel.executive) draft.panel.executive = {};
                          if (!draft.panel.executive[activeExecTab]) draft.panel.executive[activeExecTab] = {};
                          const exec = draft.panel.executive[activeExecTab];
                          if (!exec.president) exec.president = [];
                          exec.president.push({ 
                            id: `pres-${activeExecTab}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                            role: "President", 
                            name: "", 
                            imageUrl: "" 
                          });
                        }));
                      }}
                      label="Add"
                      icon={Plus}
                      size="sm"
                      variant="secondary"
                    />
                  </div>
                  <div className="space-y-6">
                    {localContent.panel.executive[activeExecTab].president?.map((p: any, i: number) => (
                      <div key={p.id} className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-6 relative group hover:border-amber-500/20 transition-all">
                        <button
                          onClick={(e) => {
                            console.log("Dashboard: President delete button clicked", p.id);
                            e.stopPropagation();
                            if (window.confirm('Remove this member?')) {
                              console.log("Dashboard: Deleting president", p.id);
                              setLocalContent((state: any) => produce(state, (draft: any) => {
                                const exec = draft.panel?.executive?.[activeExecTab];
                                if (exec?.president) {
                                  const index = exec.president.findIndex((item: any) => item.id === p.id);
                                  if (index !== -1) {
                                    exec.president.splice(index, 1);
                                    console.log("Dashboard: President removed from draft");
                                  } else {
                                    console.warn("Dashboard: President ID not found in draft", p.id);
                                  }
                                }
                              }));
                            }
                          }}
                          className="absolute top-6 right-6 p-2.5 text-zinc-500 hover:text-red-500 transition-all bg-black/60 rounded-xl border border-white/10 z-[9999] pointer-events-auto shadow-xl"
                          title="Remove President"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <DashboardFormField label="Full Name">
                          <input
                            type="text"
                            value={p.name}
                            onChange={(e) => {
                              const val = e.target.value;
                              setLocalContent(produce((draft: any) => {
                                if (draft.panel?.executive?.[activeExecTab]?.president) {
                                  const item = draft.panel.executive[activeExecTab].president.find((it: any) => it.id === p.id);
                                  if (item) item.name = val;
                                }
                              }));
                            }}
                            className="w-full px-5 py-3 bg-black/20 border border-white/10 rounded-xl text-white outline-none focus:border-amber-500/50 transition-all"
                          />
                        </DashboardFormField>
                        <DashboardFileUpload
                          path={['panel', 'executive', activeExecTab, 'president', i, 'imageUrl']}
                          value={p.imageUrl}
                          uploading={uploading === `panel-executive-${activeExecTab}-president-${i}-imageUrl`}
                          onUpload={handleFileUpload}
                          onDelete={handleDeleteFile}
                          onChange={updateFieldByPath}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* General Secretary */}
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-500" />
                      <h4 className="text-sm font-bold text-white uppercase tracking-widest">General Secretary</h4>
                    </div>
                    <DashboardButton 
                      onClick={() => {
                        setLocalContent((state: any) => produce(state, (draft: any) => {
                          if (!draft.panel) draft.panel = {};
                          if (!draft.panel.executive) draft.panel.executive = {};
                          if (!draft.panel.executive[activeExecTab]) draft.panel.executive[activeExecTab] = {};
                          const exec = draft.panel.executive[activeExecTab];
                          if (!exec.generalSecretary) exec.generalSecretary = [];
                          exec.generalSecretary.push({ 
                            id: `gs-${activeExecTab}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                            role: "General Secretary", 
                            name: "", 
                            imageUrl: "" 
                          });
                        }));
                      }}
                      label="Add"
                      icon={Plus}
                      size="sm"
                      variant="secondary"
                    />
                  </div>
                  <div className="space-y-6">
                    {localContent.panel.executive[activeExecTab].generalSecretary?.map((gs: any, i: number) => (
                      <div key={gs.id} className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-6 relative group hover:border-amber-500/20 transition-all">
                        <button
                          onClick={(e) => {
                            console.log("Dashboard: General Secretary delete button clicked", gs.id);
                            e.stopPropagation();
                            if (window.confirm('Remove this member?')) {
                              console.log("Dashboard: Deleting general secretary", gs.id);
                              setLocalContent((state: any) => produce(state, (draft: any) => {
                                const exec = draft.panel?.executive?.[activeExecTab];
                                if (exec?.generalSecretary) {
                                  const index = exec.generalSecretary.findIndex((item: any) => item.id === gs.id);
                                  if (index !== -1) {
                                    exec.generalSecretary.splice(index, 1);
                                    console.log("Dashboard: General Secretary removed from draft");
                                  } else {
                                    console.warn("Dashboard: General Secretary ID not found in draft", gs.id);
                                  }
                                }
                              }));
                            }
                          }}
                          className="absolute top-6 right-6 p-2.5 text-zinc-500 hover:text-red-500 transition-all bg-black/60 rounded-xl border border-white/10 z-[9999] pointer-events-auto shadow-xl"
                          title="Remove General Secretary"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <DashboardFormField label="Full Name">
                          <input
                            type="text"
                            value={gs.name}
                            onChange={(e) => {
                              const val = e.target.value;
                              setLocalContent(produce((draft: any) => {
                                if (draft.panel?.executive?.[activeExecTab]?.generalSecretary) {
                                  const item = draft.panel.executive[activeExecTab].generalSecretary.find((it: any) => it.id === gs.id);
                                  if (item) item.name = val;
                                }
                              }));
                            }}
                            className="w-full px-5 py-3 bg-black/20 border border-white/10 rounded-xl text-white outline-none focus:border-amber-500/50 transition-all"
                          />
                        </DashboardFormField>
                        <DashboardFileUpload
                          path={['panel', 'executive', activeExecTab, 'generalSecretary', i, 'imageUrl']}
                          value={gs.imageUrl}
                          uploading={uploading === `panel-executive-${activeExecTab}-generalSecretary-${i}-imageUrl`}
                          onUpload={handleFileUpload}
                          onDelete={handleDeleteFile}
                          onChange={updateFieldByPath}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Deputy Presidents */}
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500" />
                    <h4 className="text-sm font-bold text-white uppercase tracking-widest">Deputy Presidents</h4>
                  </div>
                  <DashboardButton 
                    onClick={() => {
                      setLocalContent((state: any) => produce(state, (draft: any) => {
                        if (!draft.panel) draft.panel = {};
                        if (!draft.panel.executive) draft.panel.executive = {};
                        if (!draft.panel.executive[activeExecTab]) draft.panel.executive[activeExecTab] = {};
                        const exec = draft.panel.executive[activeExecTab];
                        if (!exec.deputyPresidents) exec.deputyPresidents = [];
                        exec.deputyPresidents.push({ 
                          id: `dp-${activeExecTab}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                          role: "Deputy President", 
                          name: "", 
                          imageUrl: "" 
                        });
                      }));
                    }}
                    label="Add Deputy President"
                    icon={Plus}
                    size="sm"
                    variant="secondary"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {localContent.panel.executive[activeExecTab].deputyPresidents?.map((dp: any, i: number) => (
                    <div key={dp.id} className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-6 relative group hover:border-amber-500/20 transition-all">
                      <button
                        onClick={(e) => {
                          console.log("Dashboard: Deputy President delete button clicked", dp.id);
                          e.stopPropagation();
                          if (window.confirm('Remove this member?')) {
                            console.log("Dashboard: Deleting deputy president", dp.id);
                            setLocalContent((state: any) => produce(state, (draft: any) => {
                              const exec = draft.panel?.executive?.[activeExecTab];
                              if (exec?.deputyPresidents) {
                                const index = exec.deputyPresidents.findIndex((item: any) => item.id === dp.id);
                                if (index !== -1) {
                                  exec.deputyPresidents.splice(index, 1);
                                  console.log("Dashboard: Deputy President removed from draft");
                                } else {
                                  console.warn("Dashboard: Deputy President ID not found in draft", dp.id);
                                }
                              }
                            }));
                          }
                        }}
                        className="absolute top-6 right-6 p-2.5 text-zinc-500 hover:text-red-500 transition-all bg-black/60 rounded-xl border border-white/10 z-[9999] pointer-events-auto shadow-xl"
                        title="Remove Deputy President"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <DashboardFormField label="Full Name">
                        <input
                          type="text"
                          value={dp.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            setLocalContent(produce((draft: any) => {
                              if (draft.panel?.executive?.[activeExecTab]?.deputyPresidents) {
                                const item = draft.panel.executive[activeExecTab].deputyPresidents.find((it: any) => it.id === dp.id);
                                if (item) item.name = val;
                              }
                            }));
                          }}
                          className="w-full px-5 py-3 bg-black/20 border border-white/10 rounded-xl text-white outline-none focus:border-amber-500/50 transition-all"
                        />
                      </DashboardFormField>
                      <DashboardFileUpload
                        path={['panel', 'executive', activeExecTab, 'deputyPresidents', i, 'imageUrl']}
                        value={dp.imageUrl}
                        uploading={uploading === `panel-executive-${activeExecTab}-deputyPresidents-${i}-imageUrl`}
                        onUpload={handleFileUpload}
                        onDelete={handleDeleteFile}
                        onChange={updateFieldByPath}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Vice Presidents */}
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-500" />
                    <h4 className="text-sm font-bold text-white uppercase tracking-widest">Vice Presidents</h4>
                  </div>
                  <DashboardButton 
                    onClick={() => {
                      setLocalContent((state: any) => produce(state, (draft: any) => {
                        const exec = draft.panel?.executive?.[activeExecTab];
                        if (exec) {
                          if (!exec.vicePresidents) exec.vicePresidents = [];
                          exec.vicePresidents.push({ 
                            id: `vp-${activeExecTab}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                            role: "Vice President", 
                            name: "", 
                            imageUrl: "" 
                          });
                        }
                      }));
                    }}
                    label="Add Vice President"
                    icon={Plus}
                    size="sm"
                    variant="secondary"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {localContent.panel.executive[activeExecTab].vicePresidents?.map((vp: any, i: number) => (
                    <div key={vp.id} className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl relative group hover:border-amber-500/20 transition-all">
                      <button
                        onClick={(e) => {
                          console.log("Dashboard: Vice President delete button clicked", vp.id);
                          e.stopPropagation();
                          if (window.confirm('Remove this Vice President?')) {
                            console.log("Dashboard: Deleting vice president", vp.id);
                            setLocalContent((state: any) => produce(state, (draft: any) => {
                              const exec = draft.panel?.executive?.[activeExecTab];
                              if (exec?.vicePresidents) {
                                const index = exec.vicePresidents.findIndex((v: any) => v.id === vp.id);
                                if (index !== -1) {
                                  exec.vicePresidents.splice(index, 1);
                                  console.log("Dashboard: Vice President removed from draft");
                                } else {
                                  console.warn("Dashboard: Vice President ID not found in draft", vp.id);
                                }
                              }
                            }));
                          }
                        }}
                        className="absolute top-6 right-6 p-2.5 text-zinc-500 hover:text-red-500 transition-all bg-black/60 rounded-xl border border-white/10 z-[9999] pointer-events-auto shadow-xl"
                        title="Remove Vice President"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                          <DashboardFormField label="VP Name">
                            <input
                              type="text"
                              value={vp.name}
                              onChange={(e) => {
                                const val = e.target.value;
                                setLocalContent(produce((draft: any) => {
                                  if (draft.panel?.executive?.[activeExecTab]?.vicePresidents) {
                                    const item = draft.panel.executive[activeExecTab].vicePresidents.find((it: any) => it.id === vp.id);
                                    if (item) item.name = val;
                                  }
                                }));
                              }}
                              className="w-full px-5 py-3 bg-black/20 border border-white/10 rounded-xl text-white outline-none focus:border-amber-500/50 transition-all"
                            />
                          </DashboardFormField>
                          <DashboardFormField label="Designation">
                            <input
                              type="text"
                              value={vp.role}
                              onChange={(e) => {
                                const val = e.target.value;
                                setLocalContent(produce((draft: any) => {
                                  if (draft.panel?.executive?.[activeExecTab]?.vicePresidents) {
                                    const item = draft.panel.executive[activeExecTab].vicePresidents.find((it: any) => it.id === vp.id);
                                    if (item) item.role = val;
                                  }
                                }));
                              }}
                              className="w-full px-5 py-3 bg-black/20 border border-white/10 rounded-xl text-white outline-none focus:border-amber-500/50 transition-all"
                            />
                          </DashboardFormField>
                        </div>
                        <DashboardFileUpload
                          path={['panel', 'executive', activeExecTab, 'vicePresidents', i, 'imageUrl']}
                          value={vp.imageUrl}
                          uploading={uploading === `panel-executive-${activeExecTab}-vicePresidents-${i}-imageUrl`}
                          onUpload={handleFileUpload}
                          onDelete={handleDeleteFile}
                          onChange={updateFieldByPath}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Departments */}
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-500" />
                    <h4 className="text-sm font-bold text-white uppercase tracking-widest">Department Leadership</h4>
                  </div>
                  <DashboardButton 
                    onClick={() => {
                      setLocalContent((state: any) => produce(state, (draft: any) => {
                        if (!draft.panel) draft.panel = {};
                        if (!draft.panel.executive) draft.panel.executive = {};
                        if (!draft.panel.executive[activeExecTab]) draft.panel.executive[activeExecTab] = {};
                        const exec = draft.panel.executive[activeExecTab];
                        if (!exec.departments) exec.departments = [];
                        exec.departments.push({ 
                          id: `dept-${activeExecTab}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                          dept: "New Department", 
                          name: "", 
                          imageUrl: "" 
                        });
                      }));
                    }}
                    label="Add Department"
                    icon={Plus}
                    size="sm"
                    variant="secondary"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {localContent.panel.executive[activeExecTab].departments?.map((d: any, i: number) => (
                    <div key={d.id} className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-8 hover:border-amber-500/20 transition-all relative group">
                      <button
                        onClick={(e) => {
                          console.log("Dashboard: Department Head delete button clicked", d.id);
                          e.stopPropagation();
                          if (window.confirm('Remove this Department Head?')) {
                            console.log("Dashboard: Deleting department head", d.id);
                            setLocalContent((state: any) => produce(state, (draft: any) => {
                              const exec = draft.panel?.executive?.[activeExecTab];
                              if (exec?.departments) {
                                const index = exec.departments.findIndex((item: any) => item.id === d.id);
                                if (index !== -1) {
                                  exec.departments.splice(index, 1);
                                  console.log("Dashboard: Department Head removed from draft");
                                } else {
                                  console.warn("Dashboard: Department Head ID not found in draft", d.id);
                                }
                              }
                            }));
                          }
                        }}
                        className="absolute top-6 right-6 p-2.5 text-zinc-500 hover:text-red-500 transition-all bg-black/60 rounded-xl border border-white/10 z-[9999] pointer-events-auto shadow-xl"
                        title="Remove Department Head"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="grid grid-cols-1 gap-6">
                        <DashboardFormField label="Department Name">
                          <input
                            type="text"
                            value={d.dept}
                            onChange={(e) => {
                              const val = e.target.value;
                              setLocalContent(produce((draft: any) => {
                                if (draft.panel?.executive?.[activeExecTab]?.departments) {
                                  const item = draft.panel.executive[activeExecTab].departments.find((it: any) => it.id === d.id);
                                  if (item) item.dept = val;
                                }
                              }));
                            }}
                            className="w-full px-5 py-3 bg-black/20 border border-white/10 rounded-xl text-white outline-none focus:border-amber-500/50 transition-all font-bold uppercase text-[10px] tracking-widest"
                          />
                        </DashboardFormField>
                        <DashboardFormField label="Head Name">
                          <input
                            type="text"
                            placeholder="e.g. Jane Smith"
                            value={d.name}
                            onChange={(e) => {
                              const val = e.target.value;
                              setLocalContent(produce((draft: any) => {
                                if (draft.panel?.executive?.[activeExecTab]?.departments) {
                                  const item = draft.panel.executive[activeExecTab].departments.find((it: any) => it.id === d.id);
                                  if (item) item.name = val;
                                }
                              }));
                            }}
                            className="w-full px-5 py-3 bg-black/20 border border-white/10 rounded-xl text-white outline-none focus:border-amber-500/50 transition-all"
                          />
                        </DashboardFormField>
                      </div>
                      <DashboardFileUpload
                        path={['panel', 'executive', activeExecTab, 'departments', i, 'imageUrl']}
                        value={d.imageUrl}
                        uploading={uploading === `panel-executive-${activeExecTab}-departments-${i}-imageUrl`}
                        onUpload={handleFileUpload}
                        onDelete={handleDeleteFile}
                        onChange={updateFieldByPath}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Secretary Positions */}
              <div className="space-y-8">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-500" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-widest">Secretary Positions</h4>
                </div>
                
                <div className="grid grid-cols-1 gap-12">
                  {[
                    { id: 'asstGeneralSecretary', label: 'Asst. General Secretary' },
                    { id: 'jointSecretary', label: 'Joint Secretary' },
                    { id: 'organizingSecretary', label: 'Organizing Secretary' },
                    { id: 'correspondingSecretary', label: 'Corresponding Secretary' }
                  ].map((sec) => (
                    <div key={sec.id} className="p-10 bg-white/[0.01] border border-white/5 rounded-[40px] space-y-10">
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <h5 className="text-lg font-bold text-white font-display tracking-tight">{sec.label}</h5>
                          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Departmental Support</p>
                        </div>
                        <DashboardButton 
                          onClick={() => {
                            setLocalContent((state: any) => produce(state, (draft: any) => {
                              if (!draft.panel) draft.panel = {};
                              if (!draft.panel.executive) draft.panel.executive = {};
                              if (!draft.panel.executive[activeExecTab]) draft.panel.executive[activeExecTab] = {};
                              const exec = draft.panel.executive[activeExecTab];
                              if (!exec.secretaries) exec.secretaries = {};
                              if (!exec.secretaries[sec.id]) exec.secretaries[sec.id] = [];
                              exec.secretaries[sec.id].push({ 
                                id: `sec-${activeExecTab}-${sec.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                                name: "", 
                                imageUrl: "" 
                              });
                            }));
                          }}
                          label={`Add ${sec.label}`}
                          icon={Plus}
                          size="sm"
                          variant="secondary"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array.isArray(localContent.panel.executive[activeExecTab].secretaries?.[sec.id]) && 
                          localContent.panel.executive[activeExecTab].secretaries[sec.id].map((s: any, i: number) => (
                            <div key={s.id} className="p-8 bg-black/20 border border-white/5 rounded-3xl relative group hover:border-amber-500/20 transition-all">
                              <button
                                onClick={(e) => {
                                  console.log(`Dashboard: Secretary delete button clicked`, s.id);
                                  e.stopPropagation();
                                  if (window.confirm(`Remove this ${sec.label}?`)) {
                                    console.log(`Dashboard: Deleting ${sec.label}`, s.id);
                                    setLocalContent((state: any) => produce(state, (draft: any) => {
                                      const exec = draft.panel?.executive?.[activeExecTab];
                                      if (exec?.secretaries?.[sec.id]) {
                                        const index = exec.secretaries[sec.id].findIndex((secItem: any) => secItem.id === s.id);
                                        if (index !== -1) {
                                          exec.secretaries[sec.id].splice(index, 1);
                                          console.log(`Dashboard: ${sec.label} removed from draft`);
                                        } else {
                                          console.warn(`Dashboard: ${sec.label} ID not found in draft`, s.id);
                                        }
                                      }
                                    }));
                                  }
                                }}
                                className="absolute top-6 right-6 p-2.5 text-zinc-500 hover:text-red-500 transition-all bg-black/60 rounded-xl border border-white/10 z-[9999] pointer-events-auto shadow-xl"
                                title={`Remove ${sec.label}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <div className="space-y-8">
                                <DashboardFormField label="Name">
                                  <input
                                    type="text"
                                    value={s.name}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setLocalContent(produce((draft: any) => {
                                        const secs = draft.panel.executive[activeExecTab].secretaries[sec.id];
                                        const item = secs.find((it: any) => it.id === s.id);
                                        if (item) item.name = val;
                                      }));
                                    }}
                                    className="w-full px-5 py-3 bg-black/20 border border-white/10 rounded-xl text-white outline-none focus:border-amber-500/50 transition-all"
                                  />
                                </DashboardFormField>
                                <DashboardFileUpload
                                  path={['panel', 'executive', activeExecTab, 'secretaries', sec.id, i, 'imageUrl']}
                                  value={s.imageUrl}
                                  uploading={uploading === `panel-executive-${activeExecTab}-secretaries-${sec.id}-${i}-imageUrl`}
                                  onUpload={handleFileUpload}
                                  onDelete={handleDeleteFile}
                                  onChange={updateFieldByPath}
                                />
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DashboardSection>
        </div>
      )}

      {/* Notices Settings */}
      {activeTab === 'notices' && (
        <DashboardSection 
          title="Notice Board" 
          description="Keep your members informed with the latest updates and announcements."
          icon={Bell}
          actions={
            <DashboardButton 
              onClick={() => {
                setLocalContent((state: any) => produce(state, (draft: any) => {
                  if (!draft.notices) draft.notices = [];
                  draft.notices.push({ 
                    id: `notice-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    title: "", 
                    description: "", 
                    date: new Date().toISOString().split('T')[0], 
                    imageUrl: "", 
                    link: "" 
                  });
                }));
              }}
              label="Add New Notice"
              icon={Plus}
              size="sm"
            />
          }
        >
          <div className="grid grid-cols-1 gap-10">
            {localContent.notices?.map((n: any, i: number) => (
              <div key={n.id} className="p-10 bg-white/[0.02] border border-white/5 rounded-[40px] relative group hover:border-amber-500/20 transition-all duration-500">
                <button
                  onClick={(e) => {
                    console.log("Dashboard: Notice delete button clicked", n.id);
                    e.stopPropagation();
                    if (window.confirm('Delete this notice?')) {
                      console.log("Dashboard: Deleting notice", n.id);
                      setLocalContent((state: any) => produce(state, (draft: any) => {
                        if (draft?.notices) {
                          const index = draft.notices.findIndex((item: any) => item.id === n.id);
                          if (index !== -1) {
                            draft.notices.splice(index, 1);
                            console.log("Dashboard: Notice removed from draft");
                          } else {
                            console.warn("Dashboard: Notice ID not found in draft", n.id);
                          }
                        }
                      }));
                    }
                  }}
                  className="absolute top-8 right-8 p-3 text-zinc-500 hover:text-red-500 transition-all bg-black/60 rounded-2xl border border-white/10 z-[9999] pointer-events-auto shadow-xl"
                  title="Delete Notice"
                >
                  <Trash2 className="w-5 h-5" />
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <DashboardFormField label="Notice Title">
                        <input
                          type="text"
                          value={n.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            setLocalContent(produce((draft: any) => {
                              const item = draft.notices.find((it: any) => it.id === n.id);
                              if (item) item.title = val;
                            }));
                          }}
                          className="w-full px-6 py-4 bg-black/20 border border-white/10 rounded-2xl text-white outline-none focus:border-amber-500/50 transition-all font-bold text-xl"
                        />
                      </DashboardFormField>
                      <DashboardFormField label="Publish Date">
                        <input
                          type="date"
                          value={n.date}
                          onChange={(e) => {
                            const val = e.target.value;
                            setLocalContent(produce((draft: any) => {
                              const item = draft.notices.find((it: any) => it.id === n.id);
                              if (item) item.date = val;
                            }));
                          }}
                          className="w-full px-6 py-4 bg-black/20 border border-white/10 rounded-2xl text-white outline-none focus:border-amber-500/50 transition-all font-mono"
                        />
                      </DashboardFormField>
                    </div>
                    <DashboardFormField label="Description">
                      <textarea
                        value={n.description}
                        onChange={(e) => {
                          const val = e.target.value;
                          setLocalContent(produce((draft: any) => {
                            const item = draft.notices.find((it: any) => it.id === n.id);
                            if (item) item.description = val;
                          }));
                        }}
                        rows={4}
                        className="w-full px-6 py-4 bg-black/20 border border-white/10 rounded-2xl text-white outline-none focus:border-amber-500/50 transition-all leading-relaxed resize-none"
                      />
                    </DashboardFormField>
                    <DashboardFormField label="Action Link (Optional)" description="URL for 'Read More' or 'Register' button">
                      <input
                        type="text"
                        value={n.link}
                        onChange={(e) => {
                          const val = e.target.value;
                          setLocalContent(produce((draft: any) => {
                            const item = draft.notices.find((it: any) => it.id === n.id);
                            if (item) item.link = val;
                          }));
                        }}
                        placeholder="https://..."
                        className="w-full px-6 py-4 bg-black/20 border border-white/10 rounded-2xl text-white outline-none focus:border-amber-500/50 transition-all font-mono text-sm"
                      />
                    </DashboardFormField>
                  </div>
                  <DashboardFileUpload
                    label="Notice Image / PDF"
                    path={['notices', i, 'imageUrl']}
                    value={n.imageUrl}
                    uploading={uploading === `notices-${i}-imageUrl`}
                    onUpload={handleFileUpload}
                    onDelete={handleDeleteFile}
                    onChange={updateFieldByPath}
                    accept=".jpg,.jpeg,.png,.pdf"
                  />
                </div>
              </div>
            ))}
            {localContent.notices?.length === 0 && (
              <div className="py-32 text-center border-2 border-dashed border-white/5 rounded-[40px]">
                <Bell className="w-16 h-16 text-zinc-800 mx-auto mb-6" />
                <p className="text-zinc-500 font-bold uppercase tracking-[0.4em] text-xs">No active notices</p>
              </div>
            )}
          </div>
        </DashboardSection>
      )}

      {/* User Management Settings */}
      {activeTab === 'users' && (
        <UserManagement />
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
