import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Store, 
  Users, 
  PhoneCall, 
  Radio, 
  Zap, 
  Wallet, 
  Settings, 
  LayoutDashboard, 
  PlusCircle, 
  Layers,
  Activity,
  X
} from 'lucide-react';
import api from '../../services/api';

export default function Sidebar({ isMobileOpen, onClose }) {
  const location = useLocation();
  const [walletBalance, setWalletBalance] = useState(500.00);

  useEffect(() => {
    fetchWallet();
  }, [location.pathname]);

  // Close mobile sidebar on route change
  useEffect(() => {
    if (onClose) onClose();
  }, [location.pathname]);

  const fetchWallet = async () => {
    try {
      const res = await api.get('/billing');
      if (res.data.success && res.data.wallet) {
        setWalletBalance(res.data.wallet.balance);
      }
    } catch (err) {
      // fallback balance
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Solutions Store', path: '/ai-employees/store', icon: Store, badge: 'Marketplace' },
    { name: 'Active Workers', path: '/ai-employees', icon: Activity },
    { name: 'Leads & Contacts', path: '/leads', icon: Users },
    { name: 'Calls & Transcripts', path: '/calls', icon: PhoneCall },
    { name: 'Outbound Campaigns', path: '/campaigns', icon: Radio },
    { name: 'Integrations', path: '/integrations', icon: Zap },
    { name: 'Billing & Wallet', path: '/billing', icon: Wallet, value: `₹${walletBalance.toFixed(2)}` },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const sidebarContent = (
    <div className="w-64 bg-[#FFFFFF] border-r border-[#E3E3E3] flex flex-col justify-between min-h-screen select-none h-full font-sans">
      <div>
        {/* Brand Logo & Close button on Mobile */}
        <div className="p-4 border-b border-[#E3E3E3] flex items-center justify-between bg-[#FFFFFF]">
          <NavLink to="/dashboard" className="flex items-center">
            <span className="font-brand text-3xl font-bold text-[#1F1F1F] tracking-tight">
              Shiftexa
            </span>
          </NavLink>

          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-full hover:bg-[#F0F4F9] text-[#5F6368]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Featured Active Worker Card */}
        <div className="mx-3 my-3 p-3 rounded-[20px] bg-[#F0F4F9] border border-[#E3E3E3] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1A73E8] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1A73E8]"></span>
              </span>
              <span className="text-xs font-bold text-[#1F1F1F]">Meera Representative</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E8F0FE] text-[#1A73E8] font-bold">₹3.5/min</span>
          </div>
          <p className="text-[11px] text-[#5F6368] mt-1 font-normal">Real Estate Sales Representative</p>
        </div>

        {/* Navigation Items */}
        <nav className="p-2.5 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-150 ${
                  isActive
                    ? 'bg-[#E8F0FE] text-[#1A73E8]'
                    : 'text-[#444746] hover:text-[#1F1F1F] hover:bg-[#F8F9FA]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#1A73E8]' : 'text-[#5F6368]'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-[#E8F0FE] text-[#1A73E8] font-mono">
                    {item.badge}
                  </span>
                )}
                {item.value && (
                  <span className="text-[10px] font-semibold font-mono text-[#1A73E8] bg-[#E8F0FE] px-2 py-0.5 rounded-full">
                    {item.value}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom CTA Card */}
      <div className="p-3">
        <div className="p-3 rounded-[20px] bg-[#F0F4F9] border border-[#E3E3E3] text-center">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-[#5F6368] font-medium uppercase tracking-wider">Wallet Balance</span>
            <span className="text-xs font-bold text-[#1A73E8] font-mono">₹{walletBalance.toFixed(2)}</span>
          </div>
          <NavLink
            to="/billing"
            className="w-full py-2 px-3 rounded-full bg-[#1A73E8] hover:bg-[#1557B0] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-none"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Top-Up Wallet
          </NavLink>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile, fixed width on md+) */}
      <aside className="hidden md:block w-64 min-h-screen sticky top-0 h-screen z-30 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay & Slide-over Sidebar */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
          />
          {/* Drawer Content */}
          <div className="relative z-10 w-64 max-w-full bg-white h-full shadow-2xl transition transform duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}


