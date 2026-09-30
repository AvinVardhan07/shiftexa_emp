import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Building2, Bell, PhoneCall, Plus, ShieldCheck, Layers, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header({ onToggleMobileSidebar }) {
  const { user, organization } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#E3E3E3] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 font-sans">
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
          <span className="text-xs font-bold text-[#1F1F1F] tracking-wide truncate max-w-[120px] sm:max-w-none">{organization?.name || 'ABC Properties'}</span>
          <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-[#E8F0FE] text-[#1A73E8] font-semibold">
            Active
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F0F4F9] border border-[#E3E3E3] text-xs text-[#5F6368] font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-[#1A73E8]" />
          <span>System: <strong className="text-[#1A73E8] font-semibold">Online</strong></span>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Action Test Call */}
        <button
          onClick={() => navigate('/ai-employees')}
          className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-full bg-white hover:bg-[#F8F9FA] text-[#1F1F1F] border border-[#747775] transition"
        >
          <PhoneCall className="w-3.5 h-3.5 text-[#1A73E8]" />
          <span>Test Call</span>
        </button>

        {/* Hire Employee CTA */}
        <button
          onClick={() => navigate('/ai-employees/store')}
          className="flex items-center gap-1 text-xs font-semibold px-3 sm:px-4 py-2 rounded-full bg-[#1A73E8] hover:bg-[#1557B0] text-white transition shadow-none"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Add Representative</span>
          <span className="sm:hidden">Add</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#F0F4F9] border border-[#E3E3E3] flex items-center justify-center text-[#5F6368] hover:text-[#1F1F1F] transition">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#1A73E8]"></span>
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-[#E3E3E3]">
          <div className="w-8 h-8 rounded-full bg-[#1A73E8] flex items-center justify-center font-bold text-xs text-white shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-bold text-[#1F1F1F]">{user?.name || 'Sales Admin'}</div>
            <div className="text-[10px] text-[#5F6368] font-medium">ABC Owner</div>
          </div>
        </div>
      </div>
    </header>
  );
}



