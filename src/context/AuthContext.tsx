"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  profile: any | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  profile: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      const FIRST_ADMIN_UID = "uZSUS5dCcfZfQoKGju4ZcSlTqZA2";
      
      if (user) {
        // Set isAdmin immediately for the first admin to avoid UI delay
        if (user.uid === FIRST_ADMIN_UID) {
          setIsAdmin(true);
        }

        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            setProfile(data);
            setIsAdmin(data.role === 'admin' || user.uid === FIRST_ADMIN_UID);
          } else if (user.uid === FIRST_ADMIN_UID) {
            setProfile({ role: 'admin', email: user.email });
          } else {
            setProfile(null);
            setIsAdmin(false);
          }
        } catch (err) {
          console.error("Auth profile fetch error:", err);
          if (user.uid === FIRST_ADMIN_UID) {
            setIsAdmin(true);
            setProfile({ role: 'admin', email: user.email });
          } else {
            setProfile(null);
            setIsAdmin(false);
          }
        }
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, profile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
