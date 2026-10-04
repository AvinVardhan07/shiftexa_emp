import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
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
  Activity,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ isMobileOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [walletBalance, setWalletBalance] = useState(500.00);

  // Sidebar collapsed state for desktop (persisted in localStorage)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('sidebar_collapsed') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('sidebar_collapsed', isCollapsed);
  }, [isCollapsed]);

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

  const handleLogout = () => {
    if (onClose) onClose();
    logout();
    navigate('/login');
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

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const renderSidebarContent = (isMobile = false) => {
    const collapsed = !isMobile && isCollapsed;

    return (
      <div className={`bg-[#FFFFFF] border-r border-[#E3E3E3] flex flex-col justify-between min-h-screen select-none h-full font-sans transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
        <div>
          {/* Brand Logo & Menu Open/Close Toggle Header */}
          <div className={`p-4 border-b border-[#E3E3E3] flex items-center bg-[#FFFFFF] ${collapsed ? 'justify-center py-4 px-2' : 'justify-between px-4'}`}>
            {!collapsed && (
              <NavLink to="/dashboard" className="flex items-center overflow-hidden">
                <span className="font-brand text-3xl font-bold text-[#1F1F1F] tracking-tight truncate">
                  Shiftexa
                </span>
              </NavLink>
            )}

            {/* Mobile Close Button */}
            {isMobile ? (
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-[#F0F4F9] text-[#5F6368] transition"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            ) : (
              /* Desktop Sidebar Collapse/Expand Toggle Button */
              <button
                onClick={toggleCollapse}
                title={collapsed ? "Expand sidebar menu" : "Collapse sidebar menu"}
                className={`p-2 rounded-full hover:bg-[#F0F4F9] text-[#5F6368] transition flex items-center justify-center ${collapsed ? 'mx-auto' : ''}`}
                aria-label={collapsed ? "Expand sidebar menu" : "Collapse sidebar menu"}
              >
                {collapsed ? <ChevronRight className="w-5 h-5 text-[#1A73E8]" /> : <ChevronLeft className="w-4 h-4 text-[#5F6368]" />}
              </button>
            )}
          </div>

          {/* Featured Active Worker Card */}
          {!collapsed ? (
            <div className="mx-3 my-3 p-3.5 rounded-2xl bg-[#F0F4F9] border border-[#E3E3E3] relative overflow-hidden transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1A73E8] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1A73E8]"></span>
                  </span>
                  <span className="text-xs font-semibold text-[#1F1F1F]">Meera Representative</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E8F0FE] text-[#1A73E8] font-bold font-mono">₹3.5/min</span>
              </div>
              <p className="text-[11px] text-[#5F6368] mt-1 font-normal">Real Estate Sales Representative</p>
            </div>
          ) : (
            <div className="mx-auto my-3 w-10 h-10 rounded-xl bg-[#F0F4F9] border border-[#E3E3E3] flex items-center justify-center relative" title="Meera Representative (Online)">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1A73E8] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#1A73E8]"></span>
              </span>
            </div>
          )}

          {/* Navigation Items */}
          <nav className="p-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              
              if (collapsed) {
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    title={item.name}
                    className={`w-12 h-12 mx-auto flex items-center justify-center rounded-full transition-all duration-150 relative ${
                      isActive
                        ? 'bg-[#E8F0FE] text-[#1A73E8]'
                        : 'text-[#444746] hover:text-[#1F1F1F] hover:bg-[#F8F9FA]'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-[#1A73E8]' : 'text-[#5F6368]'}`} />
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#1A73E8] rounded-r-full"></span>
                    )}
                  </NavLink>
                );
              }

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

        {/* Bottom CTA Card & Logout Option */}
        <div className="p-3 border-t border-[#E3E3E3] space-y-2">
          {!collapsed ? (
            <div className="p-3 rounded-2xl bg-[#F0F4F9] border border-[#E3E3E3] text-center">
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
          ) : (
            <NavLink
              to="/billing"
              title={`Wallet: ₹${walletBalance.toFixed(2)} - Click to Top-Up`}
              className="w-12 h-12 mx-auto rounded-full bg-[#E8F0FE] text-[#1A73E8] flex items-center justify-center hover:bg-[#D2E3FC] transition"
            >
              <Wallet className="w-5 h-5" />
            </NavLink>
          )}

          {/* Sidebar Logout Button */}
          {!collapsed ? (
            <button
              onClick={handleLogout}
              className="w-full py-2 px-3 rounded-full hover:bg-rose-50 text-[#D93025] text-xs font-semibold flex items-center justify-center gap-2 transition border border-transparent hover:border-rose-200"
            >
              <LogOut className="w-4 h-4 text-[#D93025]" />
              <span>Sign Out</span>
            </button>
          ) : (
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="w-12 h-12 mx-auto rounded-full hover:bg-rose-50 text-[#D93025] flex items-center justify-center transition"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile, dynamic width on md+) */}
      <aside className={`hidden md:block sticky top-0 h-screen z-30 shrink-0 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
        {renderSidebarContent(false)}
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
            {renderSidebarContent(true)}
          </div>
        </div>
      )}
    </>
  );
}
