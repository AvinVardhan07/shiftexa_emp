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
import Dock from '../common/Dock';

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

    // Create macOS dock items configuration for the collapsed vertical sidebar
    const dockItems = navItems.map((item) => {
      const Icon = item.icon;
      const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));

      // Right-click quick action context menus
      const menuOptions = [];
      if (item.path === '/dashboard') {
        menuOptions.push({ label: 'Overview', onClick: () => navigate('/dashboard') });
        menuOptions.push({ label: 'Refresh Dashboard', onClick: () => window.location.reload() });
      } else if (item.path === '/ai-employees/store') {
        menuOptions.push({ label: 'Browse Solutions', onClick: () => navigate('/ai-employees/store') });
        menuOptions.push({ label: 'Hire Agent', onClick: () => navigate('/ai-employees/store') });
      } else if (item.path === '/ai-employees') {
        menuOptions.push({ label: 'Meera (Online)', onClick: () => navigate('/ai-employees') });
        menuOptions.push({ label: 'All Active Workers', onClick: () => navigate('/ai-employees') });
      } else if (item.path === '/leads') {
        menuOptions.push({ label: 'Leads List', onClick: () => navigate('/leads') });
        menuOptions.push({ label: 'Import Contacts', onClick: () => navigate('/leads') });
      } else if (item.path === '/calls') {
        menuOptions.push({ label: 'Call Records', onClick: () => navigate('/calls') });
        menuOptions.push({ label: 'Transcripts', onClick: () => navigate('/calls') });
      } else if (item.path === '/campaigns') {
        menuOptions.push({ label: 'Campaign Monitor', onClick: () => navigate('/campaigns') });
        menuOptions.push({ label: 'New Campaign', onClick: () => navigate('/campaigns') });
      } else if (item.path === '/integrations') {
        menuOptions.push({ label: 'Active Integrations', onClick: () => navigate('/integrations') });
        menuOptions.push({ label: 'Webhook Settings', onClick: () => navigate('/integrations') });
      } else if (item.path === '/billing') {
        menuOptions.push({ label: `Wallet Balance: ₹${walletBalance.toFixed(2)}`, onClick: () => navigate('/billing') });
        menuOptions.push({ label: 'Top-Up Wallet', onClick: () => navigate('/billing') });
      } else if (item.path === '/settings') {
        menuOptions.push({ label: 'Profile Settings', onClick: () => navigate('/settings') });
        menuOptions.push({ label: 'Preferences', onClick: () => navigate('/settings') });
      }

      return {
        icon: <Icon className="w-5 h-5 transition-transform duration-200" />,
        label: item.value ? `${item.name} (${item.value})` : item.name,
        active: isActive,
        badge: undefined, // Never display full-text badges on collapsed dock items to prevent icon overlap
        onClick: () => navigate(item.path),
        menu: menuOptions.length > 0 ? menuOptions : undefined
      };
    });

    return (
      <div className={`bg-white/95 backdrop-blur-md border-r border-slate-200/80 flex flex-col justify-between min-h-screen select-none h-full font-sans transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Brand Logo & Menu Open/Close Toggle Header */}
          <div className={`border-b border-slate-200/80 flex items-center bg-transparent shrink-0 ${collapsed ? 'justify-center py-3 px-1' : 'justify-between p-4'}`}>
            {!collapsed && (
              <NavLink to="/dashboard" className="flex items-center overflow-hidden">
                <span className="font-brand text-2xl font-bold text-slate-900 tracking-tight truncate">
                  Shiftexa
                </span>
              </NavLink>
            )}

            {/* Mobile Close Button */}
            {isMobile ? (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            ) : (
              /* Desktop Sidebar Collapse/Expand Toggle Button */
              <button
                onClick={toggleCollapse}
                title={collapsed ? "Expand sidebar menu" : "Collapse sidebar menu"}
                className={`p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition flex items-center justify-center ${collapsed ? 'mx-auto' : ''}`}
                aria-label={collapsed ? "Expand sidebar menu" : "Collapse sidebar menu"}
              >
                {collapsed ? <ChevronRight className="w-4 h-4 text-slate-600" /> : <ChevronLeft className="w-4 h-4 text-slate-500" />}
              </button>
            )}
          </div>

          {/* Featured Active Worker Card */}
          {!collapsed ? (
            <div className="mx-3 my-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 relative overflow-hidden transition-all shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-medium text-slate-900">Meera</span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 font-medium">₹3.50/min</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Real Estate Sales Representative</p>
            </div>
          ) : (
            <div className="mx-auto my-2 w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center relative shrink-0" title="Meera Representative (Online)">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
          )}

          {/* Navigation Items (Interactive Vertical Dock for collapsed, standard nav for expanded) */}
          {collapsed ? (
            <div className="relative flex-1 min-h-0 flex flex-col items-center justify-center py-1 overflow-visible">
              <Dock
                items={dockItems}
                baseItemSize={38}
                magnification={50}
                panelHeight={46}
                accentColor="#2563EB"
                badgeColor="#2563EB"
                position="left"
                distance={130}
                gap={4}
                roundness={0.45}
                bounce
                autoHide={false}
                tiles
                showLabels
                showIndicators
                showBadges={false}
                theme="light"
                className="sidebar-dock"
              />
            </div>
          ) : (
            <nav className="p-2 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {item.badge}
                      </span>
                    )}
                    {item.value && (
                      <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {item.value}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          )}
        </div>

        {/* Bottom CTA Card & Logout Option */}
        <div className={`border-t border-slate-200 shrink-0 ${collapsed ? 'p-2 space-y-1.5' : 'p-3 space-y-2'}`}>
          {!collapsed ? (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500 font-medium">Wallet Balance</span>
                <span className="text-xs font-semibold text-slate-900">₹{walletBalance.toFixed(2)}</span>
              </div>
              <NavLink
                to="/billing"
                className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Top-Up Wallet</span>
              </NavLink>
            </div>
          ) : (
            <NavLink
              to="/billing"
              title={`Wallet: ₹${walletBalance.toFixed(2)} - Click to Top-Up`}
              className="w-9 h-9 mx-auto rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 hover:scale-105 active:scale-95 transition-all duration-200 border border-blue-200"
            >
              <Wallet className="w-4 h-4" />
            </NavLink>
          )}

          {/* Sidebar Logout Button */}
          {!collapsed ? (
            <button
              onClick={handleLogout}
              className="w-full py-2 px-3 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 text-xs font-medium flex items-center justify-center gap-2 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          ) : (
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="w-9 h-9 mx-auto rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
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
