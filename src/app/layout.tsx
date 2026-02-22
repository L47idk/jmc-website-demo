"use client";
import { Inter, Space_Grotesk, JetBrains_Mono, Caveat } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ContentProvider, useContent } from "@/context/ContentContext";
import Navbar from "@/components/Navbar";
import BackgroundFormulas from "@/components/BackgroundFormulas";
import StarField from "@/components/StarField";
import SplashScreen from "@/components/SplashScreen";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

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
  const { loading } = useContent();
  const [splashFinished, setSplashFinished] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {!splashFinished ? (
        <SplashScreen 
          key="splash" 
          isLoaded={!loading} 
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
            <div className="noise absolute inset-0 opacity-[0.02]" />
            <div className="atmospheric-glow w-[600px] h-[600px] bg-amber-500/5 -top-48 -left-48" />
            <div className="atmospheric-glow w-[500px] h-[500px] bg-indigo-500/5 bottom-0 -right-24" />
            <div className="atmospheric-glow w-[400px] h-[400px] bg-emerald-500/3 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>

          <StarField />
          <BackgroundFormulas />
          <Navbar />
          <main className="flex-grow relative z-10">
            {children}
          </main>
          <footer className="bg-black/80 text-zinc-500 py-12 border-t border-white/5 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-sm font-medium tracking-wider uppercase">© 2024 Josephite Math Club • Built for thinkers.</p>
            </div>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
