"use client";
import React, { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface ContentContextType {
  content: any;
  updateContent: (section: string, data: any) => Promise<void>;
  saveAllContent: (newContent: any) => Promise<void>;
  loading: boolean;
}

const ContentContext = React.createContext<ContentContextType>({
  content: {},
  updateContent: async () => {},
  saveAllContent: async () => {},
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
        heroTitle: "Josephite Math Club",
        heroSubtitle: "Where logic meets imagination.",
        testimonialsTitle: "People About JMC",
        testimonials: [
          { name: "Anthony Prince Costa", role: "Chief Moderator", message: "As Chief Moderator, I take pride in guiding the Math Club, which reflects the spirit of our department. Our mission is to create a community where mathematics is not just about formulas but about critical thinking, curiosity, and teamwork. This club allows students to go beyond textbooks and experience the true beauty of numbers and logic.", imageUrl: "" },
          { name: "Intesher Alam Manam", role: "Club President", message: "As the President of the Math Club, I feel honored to lead such a vibrant community. My vision is to make this club a hub for discovery, learning, and collaboration. Whether it's competitions, workshops, or friendly discussions, we want every member to feel inspired and motivated to see math not as pressure, but as passion.", imageUrl: "" },
          { name: "Shoumik Saha Raj", role: "General Secretary", message: "As General Secretary, my role is to keep our Math Club organized, active, and welcoming for everyone. I work to ensure smooth coordination of events, competitions, and activities so that each member has the chance to participate and grow. Together, we are creating a community where learning mathematics is not only meaningful but also enjoyable.", imageUrl: "" },
          { name: "Monwar Rafat", role: "Deputy President", message: "Serving as Deputy President, I work alongside our president and members to ensure that the Math Club continues to grow with new initiatives. We aim to make mathematics a source of joy, exploration, and innovation for every student, giving them opportunities to learn and lead with confidence.", imageUrl: "" },
          { name: "Arefin Anwar", role: "Vice President", message: "As Vice President, I believe the true strength of our Math Club lies in teamwork and inclusiveness. We are building a community where students not only sharpen their problem-solving skills but also learn to innovate, collaborate, and enjoy mathematics as a lifelong journey of discovery.", imageUrl: "" }
        ]
      },
      about: {
        title: "Our Mathematical Legacy",
        description: "The Josephite Math Club (JMC) is the premier platform for mathematical exploration at St. Joseph's College. Founded on the principles of logic, curiosity, and excellence, we strive to transform the way students perceive and interact with the world of numbers.",
        mission: "To cultivate a deep-seated love for mathematics through rigorous competition, collaborative learning, and innovative problem-solving workshops."
      },
      panel: {
        moderators: [
          { role: "Chief Moderator", name: "Prof. Alan Turing", imageUrl: "https://picsum.photos/200/200?random=20" },
          { role: "Moderator", name: "Dr. Emmy Noether", imageUrl: "https://picsum.photos/200/200?random=21" },
          { role: "Moderator", name: "Prof. Srinivasa Ramanujan", imageUrl: "https://picsum.photos/200/200?random=22" },
        ],
        executive: {
          current: {
            president: [{ role: "President", name: "John Doe", imageUrl: "https://picsum.photos/200/200?random=23" }],
            deputyPresidents: [
              { role: "Deputy President", name: "Jane Smith", imageUrl: "https://picsum.photos/200/200?random=24" },
              { role: "Deputy President", name: "Michael Ross", imageUrl: "https://picsum.photos/200/200?random=25" },
            ],
            generalSecretary: [{ role: "General Secretary", name: "Sarah Connor", imageUrl: "https://picsum.photos/200/200?random=26" }],
            vicePresidents: [
              { role: "Vice President", name: "VP One", imageUrl: "" },
              { role: "Vice President", name: "VP Two", imageUrl: "" },
              { role: "Vice President", name: "VP Three", imageUrl: "" },
              { role: "Vice President", name: "VP Four", imageUrl: "" },
              { role: "Vice President", name: "VP Five", imageUrl: "" },
            ],
            departments: [
              { dept: "Internal Affairs", name: "Head One", imageUrl: "" },
              { dept: "External Affairs", name: "Head Two", imageUrl: "" },
              { dept: "Photography", name: "Head Three", imageUrl: "" },
              { dept: "Events", name: "Head Four", imageUrl: "" },
            ],
            secretaries: {
              asstGeneralSecretary: [
                { name: "Kazi Nafisul Bashar" },
                { name: "Tahmid Muhsin Taqi" },
                { name: "Tawsif Hamid Abir" },
                { name: "Shougoto Saha" },
                { name: "Mahdi Rasif" },
                { name: "Arefin Alam Tanjim" },
                { name: "Tauhidur Rahman" },
                { name: "Zulkarnain Zaman Aarosh" },
                { name: "Sindid Alam" },
                { name: "Muhtadee Tausif Hasan Adib" },
                { name: "MD Jarif Bin Hossain" }
              ],
              jointSecretary: [
                { name: "Swapnil Podder" },
                { name: "Ragib Ash Add" },
                { name: "Md. Nazmus Sakib" },
                { name: "Ajmol Fahim" },
                { name: "Probaho Kul Sanchalon Minhaz" },
                { name: "Shuvashish Saha" },
                { name: "S M Abir" },
                { name: "Tasdid Alam Ratul" },
                { name: "Raiyan Nafir Rhythm" },
                { name: "Sameer Saihan" }
              ],
              organizingSecretary: [
                { name: "Shuvro" },
                { name: "Riyad Miah" },
                { name: "Krrish" },
                { name: "Sadman" },
                { name: "Walid Pathan" },
                { name: "Shirsendu Das" }
              ],
              correspondingSecretary: [
                { name: "Farhan" },
                { name: "Mashnoon" },
                { name: "Oliver" },
                { name: "Shuvro Aninda Bepari" },
                { name: "Saraf Islam Nuhil" },
                { name: "Tahmid" },
                { name: "Al Wasif" }
              ]
            }
          },
          recent: {
            president: [],
            deputyPresidents: [],
            generalSecretary: [],
            vicePresidents: [],
            departments: [],
            secretaries: { asstGeneralSecretary: [], jointSecretary: [], organizingSecretary: [], correspondingSecretary: [] }
          },
          former: {
            president: [],
            deputyPresidents: [],
            generalSecretary: [],
            vicePresidents: [],
            departments: [],
            secretaries: { asstGeneralSecretary: [], jointSecretary: [], organizingSecretary: [], correspondingSecretary: [] }
          }
        }
      },
      gallery: [],
      notices: []
    };

    const fetchContent = async () => {
      // 1. Try Supabase first if configured (it's the most persistent source)
      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase
            .from('site_content')
            .select('content')
            .eq('id', 'main')
            .single();
          
          if (data && !error) {
            setContent(data.content);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.error("Error fetching supabase content:", err);
        }
      }

      // 2. Fallback to file-based content (local persistence/code-based)
      try {
        const response = await fetch('/api/content');
        if (response.ok) {
          const text = await response.text();
          try {
            const data = JSON.parse(text);
            if (data && !data.error) {
              setContent(data);
              setLoading(false);
              return;
            }
          } catch (parseErr) {
            console.error("Error parsing content JSON:", parseErr);
          }
        }
      } catch (err) {
        console.error("Error fetching file-based content:", err);
      }

      // 3. Final fallback to hardcoded defaults
      setContent(defaults);
      setLoading(false);
    };

    fetchContent();
  }, []);

  const saveAllContent = async (newContent: any) => {
    if (!isAdmin) return;
    setContent(newContent);
    
    // Update file-based content
    try {
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContent),
      });
    } catch (err) {
      console.error("Error updating file-based content:", err);
    }

    // Update Supabase
    if (isSupabaseConfigured) {
      await supabase
        .from('site_content')
        .upsert({ id: 'main', content: newContent });
    }
  };

  const updateContent = async (section: string, data: any) => {
    if (!isAdmin) return;
    const newContent = { ...content, [section]: data };
    await saveAllContent(newContent);
  };

  return (
    <ContentContext.Provider value={{ content, updateContent, saveAllContent, loading }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => React.useContext(ContentContext);
