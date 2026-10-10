import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Building2, Bell, PhoneCall, Plus, Menu, User, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header({ onToggleMobileSidebar }) {
  const { user, organization, logout } = useAuth();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setUserMenuOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 font-sans select-none">
      {/* Mobile Hamburger & Active Organization Switcher */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-700 transition"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800">
          <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="text-xs font-medium text-slate-800 tracking-tight truncate max-w-[140px] sm:max-w-none">
            {organization?.name || 'ABC Properties'}
          </span>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Action Test Call */}
        <button
          onClick={() => navigate('/ai-employees')}
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
        >
          <PhoneCall className="w-3.5 h-3.5 text-slate-500" />
          <span>Test Call</span>
        </button>

        {/* Hire Employee CTA */}
        <button
          onClick={() => navigate('/ai-employees/store')}
          className="inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Add Representative</span>
          <span className="sm:hidden">Add</span>
        </button>

        {/* Notifications */}
        <button 
          className="w-9 h-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-700 transition relative"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-blue-600"></span>
        </button>

        {/* User Profile Dropdown Menu */}
        <div className="relative pl-1 sm:pl-2 border-l border-slate-200" ref={menuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-50 transition"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center font-semibold text-xs text-white shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-semibold text-slate-900 leading-tight">{user?.name || 'Sales Admin'}</div>
              <div className="text-[11px] text-slate-500 font-normal">{user?.email || 'admin@abcproperties.com'}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* User Menu Popup */}
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl border border-slate-200 shadow-lg py-1.5 z-50">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <div className="text-xs font-semibold text-slate-900">{user?.name || 'Sales Admin'}</div>
                <div className="text-[11px] text-slate-500 truncate">{user?.email || 'admin@abcproperties.com'}</div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => { setUserMenuOpen(false); navigate('/settings'); }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Account & Settings</span>
                </button>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition"
                >
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
