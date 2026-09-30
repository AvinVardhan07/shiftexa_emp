import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import PixelParticles from '../common/PixelParticles';

export default function DashboardLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#FFFFFF] text-slate-900 font-sans relative overflow-x-hidden">
      <PixelParticles />
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 z-10 bg-[#FFFFFF]">
        <Header
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

