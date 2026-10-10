import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Globe, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white/95 backdrop-blur-md border-t border-slate-200/80 pt-10 pb-8 font-sans text-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-8 border-b border-slate-200/80">
          
          {/* Brand Info (2 Columns on LG) */}
          <div className="lg:col-span-2 space-y-3">
            <Link to="/" className="inline-block">
              <span className="font-brand text-2xl font-bold text-slate-900 tracking-tight">
                Shiftexa
              </span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm font-normal">
              Conversational voice agents for modern enterprises. Automated lead qualification, site visit scheduling, and CRM synchronization.
            </p>
            <div className="pt-1 flex items-center gap-3">
              <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                <span>Enterprise Grade Security</span>
              </div>
            </div>
          </div>

          {/* Column 1: Workforce Solutions */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900">Solutions</h4>
            <ul className="space-y-2 text-xs text-slate-500 font-normal">
              <li>
                <Link to="/ai-employees/store" className="hover:text-blue-600 transition">Real Estate Representative (Meera)</Link>
              </li>
              <li>
                <Link to="/ai-employees/store" className="hover:text-blue-600 transition">Inbound Reception & Desk</Link>
              </li>
              <li>
                <Link to="/ai-employees/store" className="hover:text-blue-600 transition">Education Admissions Desk</Link>
              </li>
              <li>
                <Link to="/ai-employees/store" className="hover:text-blue-600 transition">Enterprise Voice Workflows</Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Platform & Features */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900">Platform</h4>
            <ul className="space-y-2 text-xs text-slate-500 font-normal">
              <li>
                <Link to="/integrations" className="hover:text-blue-600 transition">Google Calendar Integration</Link>
              </li>
              <li>
                <Link to="/integrations" className="hover:text-blue-600 transition">WhatsApp Automated Dispatch</Link>
              </li>
              <li>
                <Link to="/integrations" className="hover:text-blue-600 transition">CRM Webhooks & API</Link>
              </li>
              <li>
                <Link to="/calls" className="hover:text-blue-600 transition">Diarized Transcripts & Audio</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company & Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900">Resources</h4>
            <ul className="space-y-2 text-xs text-slate-500 font-normal">
              <li>
                <a href="#faqs" className="hover:text-blue-600 transition">Documentation & Guides</a>
              </li>
              <li>
                <Link to="/billing" className="hover:text-blue-600 transition">Pricing & Billing Credits</Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-blue-600 transition">Account & API Settings</Link>
              </li>
              <li>
                <a href="mailto:support@shiftexa.com" className="hover:text-blue-600 transition flex items-center gap-1">
                  <span>Help & Support</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-normal">
          <div className="flex items-center gap-2">
            <span>© 2026 Shiftexa Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-900 transition">Privacy Policy</a>
            <a href="#" className="hover:text-slate-900 transition">Terms of Service</a>
            <a href="#" className="hover:text-slate-900 transition">Security</a>
            <div className="flex items-center gap-1 text-slate-700 font-medium pl-2 border-l border-slate-200">
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>India</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
