"use client";
import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

interface ContentContextType {
  content: any;
  updateContent: (section: string, data: any) => Promise<void>;
  loading: boolean;
}

const ContentContext = React.createContext<ContentContextType>({
  content: {},
  updateContent: async () => {},
  loading: true,
});

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const defaults = {
      site: {
        clubName: "Josephite Math Club",
        logoUrl: ""
      },
      home: {
        heroTitle: "Unravel the Mysteries of Mathematics",
        heroSubtitle: "Welcome to the Josephite Math Club. A sanctuary for logical minds and creative problem solvers.",
        features: [
          { title: "Advanced Calculus", description: "Master the language of change and motion." },
          { title: "Number Theory", description: "Explore the fundamental properties of integers." },
          { title: "Logic & Proofs", description: "Build rigorous foundations for mathematical truth." }
        ]
      },
      about: {
        title: "Our Legacy",
        text: "The Josephite Math Club has been a cornerstone of academic excellence, fostering a community where mathematics is not just a subject, but a passion."
      },
      panel: {
        moderators: [
          { role: "Chief Moderator", name: "Name Placeholder", imageUrl: "" },
          { role: "Moderator", name: "Name Placeholder", imageUrl: "" },
          { role: "Moderator", name: "Name Placeholder", imageUrl: "" },
        ],
        executive: {
          president: [{ role: "President", name: "Name Placeholder", imageUrl: "" }],
          deputyPresidents: [
            { role: "Deputy President", name: "Name Placeholder", imageUrl: "" },
            { role: "Deputy President", name: "Name Placeholder", imageUrl: "" },
          ],
          generalSecretary: [{ role: "General Secretary", name: "Name Placeholder", imageUrl: "" }],
          vicePresidents: Array(10).fill(null).map(() => ({ role: "Vice President", name: "Name Placeholder", imageUrl: "" }))
        },
        departments: [
          { dept: "Internal Affairs", name: "Name Placeholder", imageUrl: "" },
          { dept: "External Affairs", name: "Name Placeholder", imageUrl: "" },
          { dept: "Photography", name: "Name Placeholder", imageUrl: "" },
          { dept: "Equity", name: "Name Placeholder", imageUrl: "" },
          { dept: "Writings", name: "Name Placeholder", imageUrl: "" },
          { dept: "Events", name: "Name Placeholder", imageUrl: "" },
          { dept: "Decorations", name: "Name Placeholder", imageUrl: "" },
        ],
        secretaries: {
          asstGeneralSecretary: Array(11).fill(null).map(() => ({ name: "Name Placeholder", imageUrl: "" })),
          jointSecretary: Array(11).fill(null).map(() => ({ name: "Name Placeholder", imageUrl: "" })),
          organizingSecretary: Array(6).fill(null).map(() => ({ name: "Name Placeholder", imageUrl: "" })),
          correspondingSecretary: Array(7).fill(null).map(() => ({ name: "Name Placeholder", imageUrl: "" }))
        }
      },
      gallery: []
    };

    const fetchContent = async () => {
      try {
        const docRef = doc(db, 'site', 'content');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setContent(docSnap.data());
        } else {
          setContent(defaults);
        }
      } catch (err) {
        console.error("Error fetching content:", err);
        setContent(defaults);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const updateContent = async (section: string, data: any) => {
    if (!isAdmin) return;
    const newContent = { ...content, [section]: data };
    setContent(newContent);
    await setDoc(doc(db, 'site', 'content'), newContent);
  };

  return (
    <ContentContext.Provider value={{ content, updateContent, loading }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => React.useContext(ContentContext);
