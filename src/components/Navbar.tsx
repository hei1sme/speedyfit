// src/components/Navbar.tsx
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PenSquare, BookOpen, LogOut, Menu, X, Dumbbell, HeartPulse } from 'lucide-react';
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
    <div className="flex rounded-md border border-gray-200 overflow-hidden text-xs font-semibold">
      {(['en', 'vi'] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-2.5 py-1 cursor-pointer transition-colors duration-150 ${
            lang === l ? 'bg-blue-700 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <NavLink
            to="/dashboard"
            className="flex items-center gap-2 text-blue-700 font-bold text-lg"
          >
            <Dumbbell size={22} />
            <span>SpeedyFit</span>
          </NavLink>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
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
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 cursor-pointer ml-1"
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
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-2 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                <link.icon size={18} />
                {link.label}
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors duration-200 cursor-pointer w-full"
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
