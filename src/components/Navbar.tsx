"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useContent } from '../context/ContentContext';
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { auth } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';

const Navbar = () => {
  const { user, isAdmin } = useAuth();
  const { content } = useContent();
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Notice Board', path: '/notices' },
    { name: 'Contact', path: '/contact' },
    { name: 'Panel', path: '/panel' },
  ];

  const logoUrl = content?.site?.logoUrl;
  const clubName = content?.site?.clubName || 'Josephite Math';

  return (
    <nav className="sticky top-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="h-10 w-10 object-contain" referrerPolicy="no-referrer" />
              ) : (
                <div className="h-10 w-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center text-black font-bold text-xl shadow-lg shadow-amber-500/20">
                  J
                </div>
              )}
              <span className="text-xl font-bold tracking-tight text-white font-display group-hover:text-amber-400 transition-colors">{clubName}</span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm font-medium transition-all hover:text-amber-400 ${
                  pathname === link.path ? 'text-amber-400' : 'text-zinc-400'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center space-x-1 text-sm font-medium text-emerald-400 hover:text-emerald-300"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            )}
            {user ? (
              <div className="flex items-center space-x-4">
                <motion.div whileTap={{ scale: 0.9 }}>
                  <Link href="/profile" className="text-zinc-400 hover:text-amber-400">
                    <User className="h-5 w-5" />
                  </Link>
                </motion.div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => auth.signOut()}
                  className="text-zinc-400 hover:text-red-400 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </motion.button>
              </div>
            ) : (
              <motion.div whileTap={{ scale: 0.95 }}>
                <Link
                  href="/login"
                  className="inline-flex items-center px-5 py-2 rounded-full text-sm font-semibold text-black bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/20"
                >
                  Login
                </Link>
              </motion.div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-zinc-400 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-black/90 backdrop-blur-xl border-b border-white/10"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-3 rounded-xl text-base font-medium transition-all ${
                    pathname === link.path ? 'text-amber-400 bg-white/5' : 'text-zinc-300 hover:text-amber-400 hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-3 rounded-xl text-base font-medium text-emerald-400 hover:bg-white/5"
                >
                  Admin Dashboard
                </Link>
              )}
              {user ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-3 rounded-xl text-base font-medium text-zinc-300 hover:bg-white/5 hover:text-amber-400"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      auth.signOut();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-3 py-3 rounded-xl text-base font-medium text-red-400 hover:bg-white/5"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-3 rounded-xl text-base font-medium text-amber-500 hover:bg-white/5"
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
