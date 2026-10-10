import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Building2, Bell, PhoneCall, Plus, ShieldCheck, Menu, LogOut, User, ChevronDown } from 'lucide-react';
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
    <header className="h-16 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#E3E3E3] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 font-sans select-none">
      {/* Mobile Hamburger & Active Organization Switcher */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-full hover:bg-[#F0F4F9] text-[#1F1F1F] transition"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5 text-[#1F1F1F]" />
        </button>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F0F4F9] border border-[#E3E3E3] text-[#1F1F1F]">
          <Building2 className="w-4 h-4 text-[#1A73E8] shrink-0" />
          <span className="text-xs font-semibold text-[#1F1F1F] tracking-tight truncate max-w-[140px] sm:max-w-none">
            {organization?.name || 'ABC Properties'}
          </span>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Action Test Call */}
        <button
          onClick={() => navigate('/ai-employees')}
          className="btn-gemini-outline hidden sm:flex items-center gap-1.5 text-xs font-semibold px-4 py-2"
        >
          <PhoneCall className="w-3.5 h-3.5 text-[#1A73E8]" />
          <span>Test Call</span>
        </button>

        {/* Hire Employee CTA */}
        <button
          onClick={() => navigate('/ai-employees/store')}
          className="btn-gemini-primary flex items-center gap-1.5 text-xs font-semibold px-3 sm:px-4 py-2"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Add Representative</span>
          <span className="sm:hidden">Add</span>
        </button>

        {/* Notifications */}
        <button className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#F0F4F9] border border-[#E3E3E3] flex items-center justify-center text-[#5F6368] hover:text-[#1F1F1F] transition relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#1A73E8]"></span>
        </button>

        {/* User Profile Dropdown Menu */}
        <div className="relative pl-1 sm:pl-2 border-l border-[#E3E3E3]" ref={menuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-[#F0F4F9] transition"
          >
            <div className="w-8 h-8 rounded-full bg-[#1A73E8] flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-semibold text-[#1F1F1F] leading-tight">{user?.name || 'Sales Admin'}</div>
              <div className="text-[10px] text-[#5F6368] font-normal">{user?.email || 'admin@abcproperties.com'}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#5F6368] hidden sm:block" />
          </button>

          {/* User Menu Popup */}
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-[#E3E3E3] shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-3 border-b border-[#E3E3E3]">
                <div className="text-xs font-bold text-[#1F1F1F]">{user?.name || 'Sales Admin'}</div>
                <div className="text-xs text-[#5F6368] truncate">{user?.email || 'admin@abcproperties.com'}</div>
                <div className="text-[10px] text-[#1A73E8] font-semibold mt-1 bg-[#E8F0FE] px-2 py-0.5 rounded-full inline-block">
                  {organization?.name || 'ABC Properties'} Owner
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => { setUserMenuOpen(false); navigate('/settings'); }}
                  className="w-full text-left px-4 py-2 text-xs text-[#444746] hover:bg-[#F0F4F9] hover:text-[#1F1F1F] flex items-center gap-2.5 transition"
                >
                  <User className="w-4 h-4 text-[#5F6368]" />
                  <span>Account & Team Settings</span>
                </button>
              </div>

              <div className="pt-1 border-t border-[#E3E3E3]">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-xs text-[#D93025] font-semibold hover:bg-rose-50 flex items-center gap-2.5 transition"
                >
                  <LogOut className="w-4 h-4 text-[#D93025]" />
                  <span>Sign Out of Dashboard</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}




