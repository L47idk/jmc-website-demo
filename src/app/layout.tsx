"use client";
import { Caveat, Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ContentProvider, useContent } from "@/context/ContentContext";
import Navbar from "@/components/Navbar";
import BackgroundFormulas from "@/components/BackgroundFormulas";
import MathVisualizations from "@/components/MathVisualizations";
import StarField from "@/components/StarField";
import SplashScreen from "@/components/SplashScreen";
import ContactModal from "@/components/ContactModal";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-handwritten",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${caveat.variable} antialiased bg-[#050505] text-zinc-100`}
      >
        <AuthProvider>
          <ContentProvider>
            <AppContent>{children}</AppContent>
          </ContentProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

function AppContent({ children }: { children: React.ReactNode }) {
  const { loading, content } = useContent();
  const [splashFinished, setSplashFinished] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const clubName = content?.site?.clubName || 'Josephite Math Club';

  return (
    <AnimatePresence mode="wait">
      {!splashFinished ? (
        <SplashScreen 
          key="splash" 
          isLoaded={!loading} 
          logoUrl={content?.site?.logoUrl}
          onFinish={() => setSplashFinished(true)} 
        />
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="min-h-screen flex flex-col relative overflow-hidden"
        >
          {/* Atmospheric Background */}
          <div className="fixed inset-0 pointer-events-none -z-30">
            <div className="noise absolute inset-0 opacity-[0.01]" />
            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-indigo-500/5" />
          </div>

          <StarField />
          <MathVisualizations />
          <BackgroundFormulas />
          <Navbar />
          <main className="flex-grow relative z-10">
            {children}
          </main>
          
          <footer className="bg-[#050505] text-zinc-400 py-20 border-t border-white/5 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-16">
                {/* Brand Section */}
                <div className="md:col-span-5 space-y-8">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-32 relative">
                      <img 
                        src={content?.site?.logoUrl || "/images/logo.png"} 
                        alt="JMC Logo" 
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="font-display font-bold leading-tight text-white">
                      <div className="text-2xl tracking-tighter uppercase">{clubName}</div>
                    </div>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="md:col-span-2 space-y-6">
                  <h4 className="text-white font-bold uppercase tracking-widest text-xs">Navigation</h4>
                  <ul className="space-y-4">
                    <li><Link href="/" className="text-sm hover:text-amber-400 transition-colors">Home</Link></li>
                    <li><Link href="/about" className="text-sm hover:text-amber-400 transition-colors">About</Link></li>
                    <li><Link href="/panel" className="text-sm hover:text-amber-400 transition-colors">Panel</Link></li>
                  </ul>
                </div>

                {/* More Links */}
                <div className="md:col-span-2 space-y-6">
                  <h4 className="text-white font-bold uppercase tracking-widest text-xs">Explore</h4>
                  <ul className="space-y-4">
                    <li><Link href="/notices" className="text-sm hover:text-amber-400 transition-colors">Notices</Link></li>
                    <li><Link href="/#memories" className="text-sm hover:text-amber-400 transition-colors">Gallery</Link></li>
                    <li>
                      <button 
                        onClick={() => setIsContactOpen(true)}
                        className="text-sm hover:text-amber-400 transition-colors"
                      >
                        Contact
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Newsletter */}
                <div className="md:col-span-3 space-y-6">
                  <h4 className="text-white font-bold uppercase tracking-widest text-xs">Stay Updated</h4>
                  <p className="text-xs text-zinc-500">Join our newsletter for the latest math challenges and club news.</p>
                  <div className="flex flex-col space-y-3">
                    <input 
                      type="email" 
                      placeholder="Email address" 
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all placeholder:text-zinc-600"
                    />
                    <button className="bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-xl transition-all text-sm uppercase tracking-widest shadow-lg shadow-amber-500/20">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Copyright */}
              <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-[10px] tracking-[0.3em] uppercase font-bold opacity-30">
                  © JOSEPHITE MATH CLUB 2026 | ALL RIGHTS RESERVED
                </p>
                <div className="flex items-center space-x-8">
                  <Link href="/privacy" className="text-[10px] uppercase tracking-widest font-bold opacity-30 hover:opacity-100 transition-opacity">Privacy Policy</Link>
                  <Link href="/terms" className="text-[10px] uppercase tracking-widest font-bold opacity-30 hover:opacity-100 transition-opacity">Terms of Service</Link>
                </div>
              </div>
            </div>
          </footer>

          <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
