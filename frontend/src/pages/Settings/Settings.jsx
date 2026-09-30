import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Settings as SettingsIcon, Building2, Key, Users, Shield } from 'lucide-react';

export default function Settings() {
  const { organization, user } = useAuth();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Organization Settings</h1>
        <p className="text-slate-500 text-sm mt-0.5">Manage company profile, team preferences, and API credentials.</p>
      </div>

      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-600" />
          Business Profile
        </h3>

        <div className="grid md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Company Name</label>
            <input
              type="text"
              readOnly
              value={organization?.name || 'ABC Properties'}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-slate-900 bg-slate-50"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Industry</label>
            <input
              type="text"
              readOnly
              value="Real Estate Sales"
              className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-slate-900 bg-slate-50"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Key className="w-4 h-4 text-blue-600" />
          API & Webhook Keys
        </h3>
        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 flex justify-between items-center">
          <span>shiftexa_live_abcproperties_2026_key</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200">ACTIVE</span>
        </div>
      </div>
    </div>
  );
}

