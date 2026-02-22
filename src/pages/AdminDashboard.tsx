"use client";
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useContent } from '../context/ContentContext';
import { motion } from 'motion/react';
import { Save, Edit3, Image as ImageIcon, Plus, Trash2, Users, Shield, ShieldAlert } from 'lucide-react';
import { collection, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const AdminDashboard = () => {
  const { isAdmin } = useAuth();
  const { content, updateContent } = useContent();
  const [activeTab, setActiveTab] = useState('site');
  const [localContent, setLocalContent] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [manualUid, setManualUid] = useState('');
  const [promoting, setPromoting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);

  React.useEffect(() => {
    if (content) setLocalContent(JSON.parse(JSON.stringify(content)));
  }, [content]);

  React.useEffect(() => {
    if (activeTab === 'users' && isAdmin) {
      fetchUsers();
    }
  }, [activeTab, isAdmin]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersList);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const toggleAdmin = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'member' : 'admin';
    setUpdatingUser(userId);
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: newRole
      });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error("Error updating user role:", error);
      alert("Failed to update user role.");
    } finally {
      setUpdatingUser(null);
    }
  };

  const handlePromoteByUid = async () => {
    if (!manualUid.trim()) return;
    setPromoting(true);
    try {
      const userRef = doc(db, 'users', manualUid.trim());
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        alert("User with this UID does not exist in the database.");
        return;
      }

      await updateDoc(userRef, {
        role: 'admin'
      });
      
      alert(`User ${userSnap.data().email || manualUid} has been promoted to Admin.`);
      setManualUid('');
      if (activeTab === 'users') fetchUsers();
    } catch (error) {
      console.error("Error promoting user:", error);
      alert("Failed to promote user. Check the console for details.");
    } finally {
      setPromoting(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
          <p className="text-zinc-400">You do not have administrative privileges.</p>
        </div>
      </div>
    );
  }

  if (!localContent) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-zinc-400">Loading...</div>;

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateContent(activeTab, localContent[activeTab]);
      alert('Content updated successfully!');
    } catch (error) {
      console.error("Error saving content:", error);
      alert("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (section: string, field: string, value: any) => {
    setLocalContent({
      ...localContent,
      [section]: { ...localContent[section], [field]: value }
    });
  };

  const updateFeature = (index: number, field: string, value: any) => {
    const newFeatures = [...localContent.home.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setLocalContent({
      ...localContent,
      home: { ...localContent.home, features: newFeatures }
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] flex">
      {/* Sidebar */}
      <div className="w-72 bg-white/5 backdrop-blur-xl border-r border-white/10 p-8">
        <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-8">Management</h2>
        <nav className="space-y-3">
          {['site', 'home', 'about', 'panel', 'gallery', 'contact', 'users'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-5 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-3 ${
                activeTab === tab ? 'bg-amber-600 text-black shadow-lg shadow-amber-600/20' : 'text-zinc-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {tab === 'users' && <Users className="w-4 h-4" />}
              {tab === 'panel' && <Users className="w-4 h-4" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Settings
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-4xl font-bold text-white font-display">Edit {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black rounded-full font-bold hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Changes
                </>
              )}
            </motion.button>
          </div>

          {activeTab === 'site' && (
            <section className="glass-card p-8">
              <h3 className="text-xl font-bold text-white mb-6">General Site Settings</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Club Name</label>
                  <input
                    type="text"
                    value={localContent.site?.clubName || ''}
                    onChange={(e) => updateField('site', 'clubName', e.target.value)}
                    className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Logo Image URL</label>
                  <input
                    type="text"
                    placeholder="https://example.com/logo.png"
                    value={localContent.site?.logoUrl || ''}
                    onChange={(e) => updateField('site', 'logoUrl', e.target.value)}
                    className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                  <p className="text-xs text-zinc-500 mt-2 italic">Provide a direct link to your club logo image.</p>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'home' && (
            <div className="space-y-8">
              <section className="glass-card p-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-amber-500" /> Hero Section
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Hero Title</label>
                    <input
                      type="text"
                      value={localContent.home.heroTitle}
                      onChange={(e) => updateField('home', 'heroTitle', e.target.value)}
                      className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Hero Subtitle</label>
                    <textarea
                      value={localContent.home.heroSubtitle}
                      onChange={(e) => updateField('home', 'heroSubtitle', e.target.value)}
                      className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-amber-500 outline-none h-32"
                    />
                  </div>
                </div>
              </section>

              <section className="glass-card p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white">Features</h3>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const newFeatures = [...localContent.home.features, { title: "", description: "" }];
                    setLocalContent({
                      ...localContent,
                      home: { ...localContent.home, features: newFeatures }
                    });
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-bold transition-all"
                >
                  <Plus className="w-4 h-4" /> Add Feature
                </motion.button>
                </div>
                <div className="space-y-6">
                  {localContent.home.features.map((feature: any, i: number) => (
                    <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/5 relative group">
                      <button
                        onClick={() => {
                          const newFeatures = localContent.home.features.filter((_: any, idx: number) => idx !== i);
                          setLocalContent({
                            ...localContent,
                            home: { ...localContent.home, features: newFeatures }
                          });
                        }}
                        className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="grid grid-cols-1 gap-4 pr-10">
                        <input
                          type="text"
                          placeholder="Feature Title"
                          value={feature.title}
                          onChange={(e) => updateFeature(i, 'title', e.target.value)}
                          className="w-full px-4 py-2 bg-transparent border border-white/10 rounded-lg text-white outline-none"
                        />
                        <textarea
                          placeholder="Feature Description"
                          value={feature.description}
                          onChange={(e) => updateFeature(i, 'description', e.target.value)}
                          className="w-full px-4 py-2 bg-transparent border border-white/10 rounded-lg text-white outline-none h-24"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'about' && (
            <section className="glass-card p-8">
              <h3 className="text-xl font-bold text-white mb-6">About Content</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Title</label>
                  <input
                    type="text"
                    value={localContent.about.title}
                    onChange={(e) => setLocalContent({...localContent, about: {...localContent.about, title: e.target.value}})}
                    className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Main Text</label>
                  <textarea
                    value={localContent.about.text}
                    onChange={(e) => setLocalContent({...localContent, about: {...localContent.about, text: e.target.value}})}
                    className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-amber-500 outline-none h-48"
                  />
                </div>
              </div>
            </section>
          )}

          {activeTab === 'gallery' && (
            <section className="glass-card p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Gallery Management</h3>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const newGallery = [...(localContent.gallery || []), { url: "", caption: "" }];
                    setLocalContent({ ...localContent, gallery: newGallery });
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-bold transition-all"
                >
                  <Plus className="w-4 h-4" /> Add Image
                </motion.button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(localContent.gallery || []).map((img: any, i: number) => (
                  <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/5 relative group">
                    <button
                      onClick={() => {
                        const newGallery = localContent.gallery.filter((_: any, idx: number) => idx !== i);
                        setLocalContent({ ...localContent, gallery: newGallery });
                      }}
                      className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="space-y-4">
                      {img.url && (
                        <div className="aspect-video rounded-lg overflow-hidden bg-black/20">
                          <img src={img.url} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      )}
                      <input
                        type="text"
                        placeholder="Image URL"
                        value={img.url}
                        onChange={(e) => {
                          const newGallery = [...localContent.gallery];
                          newGallery[i].url = e.target.value;
                          setLocalContent({ ...localContent, gallery: newGallery });
                        }}
                        className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white text-sm outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Caption"
                        value={img.caption}
                        onChange={(e) => {
                          const newGallery = [...localContent.gallery];
                          newGallery[i].caption = e.target.value;
                          setLocalContent({ ...localContent, gallery: newGallery });
                        }}
                        className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white text-sm outline-none"
                      />
                    </div>
                  </div>
                ))}
                {(localContent.gallery || []).length === 0 && (
                  <div className="col-span-full p-20 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center bg-white/5">
                    <ImageIcon className="w-16 h-16 text-zinc-600 mb-4" />
                    <p className="text-sm text-zinc-500">No images in gallery. Add some using the button above.</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {activeTab === 'contact' && (
            <section className="glass-card p-8">
              <h3 className="text-xl font-bold text-white mb-6">Contact Information</h3>
              <p className="text-zinc-400 mb-6">Update the contact details shown on the contact page.</p>
              <div className="mt-4 p-4 bg-amber-500/10 text-amber-400 rounded-xl text-sm border border-amber-500/20">
                Contact info editing is coming soon in the next update.
              </div>
            </section>
          )}

          {activeTab === 'panel' && (
            <div className="space-y-8">
              {/* Moderators */}
              <section className="glass-card p-8">
                <h3 className="text-xl font-bold text-white mb-6">Moderators</h3>
                <div className="space-y-4">
                  {localContent.panel.moderators.map((m: any, i: number) => (
                    <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white/5 rounded-xl">
                      <input
                        type="text"
                        placeholder="Role"
                        value={m.role}
                        onChange={(e) => {
                          const newMods = [...localContent.panel.moderators];
                          newMods[i].role = e.target.value;
                          updateField('panel', 'moderators', newMods);
                        }}
                        className="px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Name"
                        value={m.name}
                        onChange={(e) => {
                          const newMods = [...localContent.panel.moderators];
                          newMods[i].name = e.target.value;
                          updateField('panel', 'moderators', newMods);
                        }}
                        className="px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Image URL"
                        value={m.imageUrl}
                        onChange={(e) => {
                          const newMods = [...localContent.panel.moderators];
                          newMods[i].imageUrl = e.target.value;
                          updateField('panel', 'moderators', newMods);
                        }}
                        className="px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white text-sm"
                      />
                    </div>
                  ))}
                  <motion.button 
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      const newMods = [...localContent.panel.moderators, { role: "Moderator", name: "", imageUrl: "" }];
                      updateField('panel', 'moderators', newMods);
                    }}
                    className="w-full py-3 border border-dashed border-white/10 rounded-xl text-zinc-500 hover:text-white hover:border-white/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Moderator
                  </motion.button>
                </div>
              </section>

              {/* Executive Committee */}
              <section className="glass-card p-8">
                <h3 className="text-xl font-bold text-white mb-6">Executive Committee</h3>
                <div className="space-y-8">
                  {/* President */}
                  <div>
                    <h4 className="text-sm font-bold text-amber-500 uppercase mb-4">President</h4>
                    {localContent.panel.executive.president.map((p: any, i: number) => (
                      <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Name"
                          value={p.name}
                          onChange={(e) => {
                            const newExec = {...localContent.panel.executive};
                            newExec.president[i].name = e.target.value;
                            updateField('panel', 'executive', newExec);
                          }}
                          className="px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Image URL"
                          value={p.imageUrl}
                          onChange={(e) => {
                            const newExec = {...localContent.panel.executive};
                            newExec.president[i].imageUrl = e.target.value;
                            updateField('panel', 'executive', newExec);
                          }}
                          className="px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white text-sm"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Deputy Presidents */}
                  <div>
                    <h4 className="text-sm font-bold text-amber-500 uppercase mb-4">Deputy Presidents</h4>
                    <div className="space-y-4">
                      {localContent.panel.executive.deputyPresidents.map((p: any, i: number) => (
                        <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="Name"
                            value={p.name}
                            onChange={(e) => {
                              const newExec = {...localContent.panel.executive};
                              newExec.deputyPresidents[i].name = e.target.value;
                              updateField('panel', 'executive', newExec);
                            }}
                            className="px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Image URL"
                            value={p.imageUrl}
                            onChange={(e) => {
                              const newExec = {...localContent.panel.executive};
                              newExec.deputyPresidents[i].imageUrl = e.target.value;
                              updateField('panel', 'executive', newExec);
                            }}
                            className="px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white text-sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Vice Presidents */}
                  <div>
                    <h4 className="text-sm font-bold text-amber-500 uppercase mb-4">Vice Presidents</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {localContent.panel.executive.vicePresidents.map((p: any, i: number) => (
                        <div key={i} className="p-4 bg-white/5 rounded-xl space-y-2">
                          <input
                            type="text"
                            placeholder="Name"
                            value={p.name}
                            onChange={(e) => {
                              const newExec = {...localContent.panel.executive};
                              newExec.vicePresidents[i].name = e.target.value;
                              updateField('panel', 'executive', newExec);
                            }}
                            className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Image URL"
                            value={p.imageUrl}
                            onChange={(e) => {
                              const newExec = {...localContent.panel.executive};
                              newExec.vicePresidents[i].imageUrl = e.target.value;
                              updateField('panel', 'executive', newExec);
                            }}
                            className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white text-sm"
                          />
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={() => {
                        const newExec = {...localContent.panel.executive};
                        newExec.vicePresidents.push({ role: "Vice President", name: "", imageUrl: "" });
                        updateField('panel', 'executive', newExec);
                      }}
                      className="w-full mt-4 py-3 border border-dashed border-white/10 rounded-xl text-zinc-500 hover:text-white hover:border-white/30 transition-all flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add Vice President
                    </button>
                  </div>
                </div>
              </section>

              {/* Departments */}
              <section className="glass-card p-8">
                <h3 className="text-xl font-bold text-white mb-6">Department Leadership</h3>
                <div className="space-y-4">
                  {localContent.panel.departments.map((d: any, i: number) => (
                    <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white/5 rounded-xl">
                      <input
                        type="text"
                        placeholder="Department"
                        value={d.dept}
                        onChange={(e) => {
                          const newDepts = [...localContent.panel.departments];
                          newDepts[i].dept = e.target.value;
                          updateField('panel', 'departments', newDepts);
                        }}
                        className="px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Name"
                        value={d.name}
                        onChange={(e) => {
                          const newDepts = [...localContent.panel.departments];
                          newDepts[i].name = e.target.value;
                          updateField('panel', 'departments', newDepts);
                        }}
                        className="px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Image URL"
                        value={d.imageUrl}
                        onChange={(e) => {
                          const newDepts = [...localContent.panel.departments];
                          newDepts[i].imageUrl = e.target.value;
                          updateField('panel', 'departments', newDepts);
                        }}
                        className="px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white text-sm"
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* Secretaries */}
              <section className="glass-card p-8">
                <h3 className="text-xl font-bold text-white mb-6">Secretary Positions</h3>
                <div className="space-y-8">
                  {Object.entries(localContent.panel.secretaries).map(([key, list]: [string, any]) => (
                    <div key={key}>
                      <h4 className="text-sm font-bold text-amber-500 uppercase mb-4">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {list.map((s: any, i: number) => (
                          <div key={i} className="p-4 bg-white/5 rounded-xl space-y-2">
                            <input
                              type="text"
                              placeholder="Name"
                              value={s.name}
                              onChange={(e) => {
                                const newSecs = {...localContent.panel.secretaries};
                                newSecs[key][i].name = e.target.value;
                                updateField('panel', 'secretaries', newSecs);
                              }}
                              className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white text-sm"
                            />
                            <input
                              type="text"
                              placeholder="Image URL"
                              value={s.imageUrl}
                              onChange={(e) => {
                                const newSecs = {...localContent.panel.secretaries};
                                newSecs[key][i].imageUrl = e.target.value;
                                updateField('panel', 'secretaries', newSecs);
                              }}
                              className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white text-sm"
                            />
                          </div>
                        ))}
                      </div>
                      <button 
                        onClick={() => {
                          const newSecs = {...localContent.panel.secretaries};
                          newSecs[key].push({ name: "", imageUrl: "" });
                          updateField('panel', 'secretaries', newSecs);
                        }}
                        className="w-full mt-4 py-3 border border-dashed border-white/10 rounded-xl text-zinc-500 hover:text-white hover:border-white/30 transition-all flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" /> Add Member to {key}
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'users' && (
            <section className="glass-card p-8">
              <div className="mb-10 p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                <h4 className="text-white font-bold mb-2">Promote by UID</h4>
                <p className="text-xs text-zinc-400 mb-4">Paste a User ID directly from the Firebase console to grant administrative access.</p>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={manualUid}
                    onChange={(e) => setManualUid(e.target.value)}
                    placeholder="Enter User UID (e.g. 5xY9...)"
                    className="flex-1 px-4 py-2 bg-black/20 border border-white/10 rounded-xl text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                  <button
                    onClick={handlePromoteByUid}
                    disabled={promoting || !manualUid.trim()}
                    className="px-6 py-2 bg-amber-600 text-black rounded-xl text-sm font-bold hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {promoting ? 'Promoting...' : 'Promote to Admin'}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-bold text-white">User Management</h3>
                  <p className="text-sm text-zinc-400 mt-1">Manage roles and permissions for club members.</p>
                </div>
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={fetchUsers}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors text-zinc-400"
                  title="Refresh users"
                >
                  <Plus className="w-5 h-5 rotate-45" />
                </motion.button>
              </div>

              {loadingUsers ? (
                <div className="py-12 text-center text-zinc-500">Loading users...</div>
              ) : (
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${user.role === 'admin' ? 'bg-amber-600 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                          {user.name?.charAt(0) || user.email?.charAt(0)}
                        </div>
                        <div>
                          <div className="text-white font-medium">{user.name || 'Anonymous'}</div>
                          <div className="text-xs text-zinc-500">{user.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-md ${user.role === 'admin' ? 'bg-amber-500/20 text-amber-400' : 'bg-zinc-500/10 text-zinc-500'}`}>
                          {user.role}
                        </span>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleAdmin(user.id, user.role)}
                          disabled={updatingUser === user.id}
                          className={`p-2 rounded-xl transition-all disabled:opacity-50 ${user.role === 'admin' ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'}`}
                          title={user.role === 'admin' ? 'Demote to Member' : 'Promote to Admin'}
                        >
                          {updatingUser === user.id ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            user.role === 'admin' ? <ShieldAlert className="w-4 h-4" /> : <Shield className="w-4 h-4" />
                          )}
                        </motion.button>
                      </div>
                    </div>
                  ))}
                  {users.length === 0 && (
                    <div className="py-12 text-center text-zinc-500">No users found.</div>
                  )}
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
