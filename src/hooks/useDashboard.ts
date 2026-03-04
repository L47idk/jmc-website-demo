"use client";
import { useState, useEffect, useCallback } from 'react';
import { produce } from 'immer';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useContent } from '../context/ContentContext';

export const useDashboard = () => {
  const { isAdmin, loading: authLoading } = useAuth();
  const { content, saveAllContent } = useContent();
  const [localContent, setLocalContent] = useState<any>(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  // Initialize local content with stable IDs
  useEffect(() => {
    if (content && Object.keys(content).length > 0 && !hasInitialized) {
      console.log("Dashboard: Initializing local content from source of truth...");
      const next = JSON.parse(JSON.stringify(content));
      
      const ensureIds = (obj: any, prefix: string = 'item'): any => {
        if (Array.isArray(obj)) {
          return obj.map((item: any, i: number) => {
            if (item && typeof item === 'object' && !Array.isArray(item)) {
              const newItem = { ...item };
              if (!newItem.id) {
                newItem.id = `${prefix}-${i}-${Math.random().toString(36).substr(2, 9)}`;
              }
              Object.keys(newItem).forEach(key => {
                newItem[key] = ensureIds(newItem[key], `${prefix}-${key}`);
              });
              return newItem;
            } else if (typeof item === 'string' && prefix.includes('gallery')) {
              return { id: `gallery-${i}-${Math.random().toString(36).substr(2, 9)}`, url: item };
            }
            return item;
          });
        } else if (obj && typeof obj === 'object') {
          const newObj = { ...obj };
          Object.keys(newObj).forEach(key => {
            newObj[key] = ensureIds(newObj[key], `${prefix}-${key}`);
          });
          return newObj;
        }
        return obj;
      };

      const initialized = ensureIds(next, 'root');
      setLocalContent(initialized);
      setHasInitialized(true);
      console.log("Dashboard: Initialization complete.", initialized);
    }
  }, [content, hasInitialized]);

  const updateFieldByPath = useCallback((path: (string | number)[], value: any) => {
    setLocalContent((state: any) => {
      const newState = produce(state, (draft: any) => {
        let current = draft;
        for (let i = 0; i < path.length - 1; i++) {
          const key = path[i];
          if (!current[key]) {
            current[key] = typeof path[i+1] === 'number' ? [] : {};
          }
          current = current[key];
        }
        current[path[path.length - 1]] = value;
      });
      console.log(`Dashboard: Updated field at ${path.join('.')}`, value);
      return newState;
    });
  }, []);

  const handleSave = async () => {
    if (!isAdmin) return;
    setSaving(true);
    setSaveSuccess(false);
    try {
      const dataToSave = produce(localContent, (draft: any) => {
        if (Array.isArray(draft.gallery)) {
          draft.gallery = draft.gallery.map((item: any) => 
            (item && typeof item === 'object' && 'url' in item) ? item.url : item
          );
        }
      });

      await saveAllContent(dataToSave);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving content:", error);
      alert("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, path: (string | number)[]) => {
    if (!isSupabaseConfigured) {
      alert("Database is not configured. File upload is disabled.");
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const isValidExtension = ['jpg', 'jpeg', 'png', 'pdf'].includes(fileExtension || '');

    if (!validTypes.includes(file.type) && !isValidExtension) {
      alert("Only .jpg, .png and .pdf formats are allowed.");
      return;
    }

    const uploadId = path.join('-');
    setUploading(uploadId);

    try {
      const extension = file.name.split('.').pop();
      const baseName = file.name.split('.').slice(0, -1).join('.');
      const sanitizedBase = baseName
        .replace(/[^\x00-\x7F]/g, "")
        .replace(/[^a-z0-9]/gi, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      
      const finalBase = sanitizedBase || "file";
      const fileName = `${Date.now()}-${finalBase}.${extension}`;

      const { data, error } = await supabase.storage
        .from('image')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('image')
        .getPublicUrl(fileName);

      updateFieldByPath(path, publicUrl);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload file.");
    } finally {
      setUploading(null);
    }
  };

  const handleDeleteFile = (path: (string | number)[]) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    updateFieldByPath(path, "");
  };

  const resetLocalContent = useCallback(() => {
    if (content && Object.keys(content).length > 0) {
      console.log("Dashboard: Resetting local content to server state...");
      const next = JSON.parse(JSON.stringify(content));
      
      const ensureIds = (obj: any, prefix: string = 'item'): any => {
        if (Array.isArray(obj)) {
          return obj.map((item: any, i: number) => {
            if (item && typeof item === 'object' && !Array.isArray(item)) {
              const newItem = { ...item };
              if (!newItem.id) {
                newItem.id = `${prefix}-${i}-${Math.random().toString(36).substr(2, 9)}`;
              }
              Object.keys(newItem).forEach(key => {
                newItem[key] = ensureIds(newItem[key], `${prefix}-${key}`);
              });
              return newItem;
            } else if (typeof item === 'string' && prefix.includes('gallery')) {
              return { id: `gallery-${i}-${Math.random().toString(36).substr(2, 9)}`, url: item };
            }
            return item;
          });
        } else if (obj && typeof obj === 'object') {
          const newObj = { ...obj };
          Object.keys(newObj).forEach(key => {
            newObj[key] = ensureIds(newObj[key], `${prefix}-${key}`);
          });
          return newObj;
        }
        return obj;
      };

      setLocalContent(ensureIds(next, 'root'));
      console.log("Dashboard: Reset complete.");
    }
  }, [content]);

  return {
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
  };
};
