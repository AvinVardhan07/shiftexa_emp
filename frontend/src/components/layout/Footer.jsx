import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Globe, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#FFFFFF] border-t border-[#E3E3E3] pt-12 pb-8 font-sans text-[#1F1F1F] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-[#E3E3E3]">
          
          {/* Brand Info (2 Columns on LG) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-brand text-3xl font-bold text-[#1F1F1F] tracking-tight">
                Shiftexa
              </span>
            </Link>
            <p className="text-xs text-[#5F6368] leading-relaxed max-w-sm font-normal">
              Empowering modern Indian enterprises with conversational digital workforce representatives. Automated regional lead qualification, site visit scheduling, and CRM syncing.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F0FE] text-[#1A73E8] text-[11px] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#1A73E8] animate-pulse"></span>
                <span>All Systems Operational</span>
              </div>
              <div className="inline-flex items-center gap-1 text-[11px] text-[#5F6368] font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1A73E8]" />
                <span>Enterprise Grade Security</span>
              </div>
            </div>
          </div>

          {/* Column 1: Workforce Solutions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1F1F1F]">Solutions</h4>
            <ul className="space-y-2 text-xs text-[#5F6368] font-normal">
              <li>
                <Link to="/ai-employees/store" className="hover:text-[#1A73E8] transition">Real Estate Representative (Meera)</Link>
              </li>
              <li>
                <Link to="/ai-employees/store" className="hover:text-[#1A73E8] transition">Inbound Reception & Desk</Link>
              </li>
              <li>
                <Link to="/ai-employees/store" className="hover:text-[#1A73E8] transition">Education Admissions Desk</Link>
              </li>
              <li>
                <Link to="/ai-employees/store" className="hover:text-[#1A73E8] transition">Custom Enterprise Workflows</Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Platform & Features */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1F1F1F]">Platform</h4>
            <ul className="space-y-2 text-xs text-[#5F6368] font-normal">
              <li>
                <Link to="/integrations" className="hover:text-[#1A73E8] transition">Google Calendar Integration</Link>
              </li>
              <li>
                <Link to="/integrations" className="hover:text-[#1A73E8] transition">WhatsApp Automated Dispatch</Link>
              </li>
              <li>
                <Link to="/integrations" className="hover:text-[#1A73E8] transition">CRM Webhooks & API</Link>
              </li>
              <li>
                <Link to="/calls" className="hover:text-[#1A73E8] transition">Diarized Transcripts & Audio</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company & Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1F1F1F]">Resources</h4>
            <ul className="space-y-2 text-xs text-[#5F6368] font-normal">
              <li>
                <a href="#faqs" className="hover:text-[#1A73E8] transition">Frequently Asked Questions</a>
              </li>
              <li>
                <Link to="/billing" className="hover:text-[#1A73E8] transition">Pricing & Billing Credits</Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-[#1A73E8] transition">Account & API Settings</Link>
              </li>
              <li>
                <a href="mailto:support@shiftexa.com" className="hover:text-[#1A73E8] transition flex items-center gap-1">
                  <span>Help & Support</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5F6368] font-normal">
          <div className="flex items-center gap-2">
            <span>© 2026 Shiftexa Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-[#1F1F1F] transition">Privacy Policy</a>
            <a href="#" className="hover:text-[#1F1F1F] transition">Terms of Service</a>
            <a href="#" className="hover:text-[#1F1F1F] transition">Security</a>
            <div className="flex items-center gap-1 text-[#1F1F1F] font-medium pl-2 border-l border-[#E3E3E3]">
              <Globe className="w-3.5 h-3.5 text-[#1A73E8]" />
              <span>India</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
