// src/components/Navbar.tsx
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PenSquare, BookOpen, LogOut, Menu, X, Dumbbell, HeartPulse, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

import { supabase } from '../lib/supabaseClient';
import { useLang } from '../contexts/LangContext';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { lang, setLang, t } = useLang();

  const navLinks = [
    { to: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { to: '/log', label: t('nav.log'), icon: PenSquare },
    { to: '/rulebook', label: t('nav.rulebook'), icon: BookOpen },
    { to: '/guides', label: t('nav.guides'), icon: HeartPulse },
    { to: '/settings', label: t('nav.settings'), icon: Settings },
  ];

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(t('nav.logoutFail'));
      console.error('Logout error:', error);
    } else {
      navigate('/login', { replace: true });
    }
    setMobileOpen(false);
  };

  const LangToggle = () => (
    <div className="flex rounded-xl overflow-hidden text-xs font-semibold" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
      {(['en', 'vi'] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-2.5 py-1 cursor-pointer transition-all duration-200 ${
            lang === l
              ? 'bg-indigo-500/90 text-white'
              : 'bg-white/40 text-gray-500 hover:bg-white/60'
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );

  return (
    <nav className="glass-strong sticky top-0 z-50" style={{ borderBottom: '1px solid rgba(255,255,255,0.5)' }}>
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <NavLink
            to="/dashboard"
            className="flex items-center gap-2 font-extrabold text-lg"
          >
            <div className="p-1.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
              <Dumbbell size={18} />
            </div>
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">SpeedyFit</span>
          </NavLink>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-indigo-500/10 text-indigo-600 shadow-sm'
                      : 'text-gray-500 hover:bg-white/50 hover:text-gray-800'
                  }`
                }
              >
                <link.icon size={16} />
                {link.label}
              </NavLink>
            ))}
            <LangToggle />
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-500 hover:bg-white/50 hover:text-gray-800 transition-all duration-200 cursor-pointer ml-1"
            >
              <LogOut size={16} />
              {t('nav.logout')}
            </button>
          </div>

          {/* Mobile: lang toggle + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <LangToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl text-gray-500 hover:bg-white/50 cursor-pointer transition-all duration-200"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass-strong" style={{ borderTop: '1px solid rgba(255,255,255,0.4)' }}>
          <div className="px-4 py-2 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-indigo-500/10 text-indigo-600'
                      : 'text-gray-500 hover:bg-white/50'
                  }`
                }
              >
                <link.icon size={18} />
                {link.label}
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-white/50 transition-all duration-200 cursor-pointer w-full"
            >
              <LogOut size={18} />
              {t('nav.logout')}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
