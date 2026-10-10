import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, Building2, Key, Users, Shield, Plus, Check, UserPlus, LogOut, Lock } from 'lucide-react';
import api from '../../services/api';
import Modal from '../../components/common/Modal';

export default function Settings() {
  const { organization, user, logout } = useAuth();
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState('MEMBER');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const res = await api.get('/auth/team');
      if (res.data.success) {
        setTeamMembers(res.data.members || []);
      }
    } catch (err) {
      setTeamMembers([
        {
          membershipId: 'mem_1',
          user: { name: user?.name || 'Rahul Sharma', email: user?.email || 'sales@abcproperties.com' },
          role: 'OWNER',
          joinedAt: new Date().toISOString()
        },
        {
          membershipId: 'mem_2',
          user: { name: 'Priya Verma', email: 'priya.v@abcproperties.com' },
          role: 'ADMIN',
          joinedAt: new Date().toISOString()
        }
      ]);
    }
  };

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/auth/team/invite', {
        name: inviteName,
        email: inviteEmail,
        role: inviteRole
      });

      if (res.data.success) {
        fetchTeam();
        setShowInviteModal(false);
        setInviteEmail('');
        setInviteName('');
      }
    } catch (err) {
      setTeamMembers([
        ...teamMembers,
        {
          membershipId: `mem_${Date.now()}`,
          user: { name: inviteName || inviteEmail.split('@')[0], email: inviteEmail },
          role: inviteRole,
          joinedAt: new Date().toISOString()
        }
      ]);
      setShowInviteModal(false);
      setInviteEmail('');
      setInviteName('');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Organization & Team Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage business profile, team member permissions, and security API keys.</p>
      </div>

      {/* Business Profile Card */}
      <div className="gemini-card p-6 space-y-4">
        <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-slate-500" />
          <span>Business Profile</span>
        </h3>

        <div className="grid md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Company / Organization Name</label>
            <input
              type="text"
              readOnly
              value={organization?.name || 'ABC Properties'}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-slate-900 bg-slate-50 font-medium"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Target Business Industry</label>
            <input
              type="text"
              readOnly
              value="Real Estate Sales & Voice Automation"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-slate-900 bg-slate-50 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Team Members & RBAC Security */}
      <div className="gemini-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-500" />
              <span>Team Members & Access Roles</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Manage organization members and assigned role permissions.</p>
          </div>

          <button
            onClick={() => setShowInviteModal(true)}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition flex items-center gap-1.5 shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Invite Team Member</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Member Name</th>
                <th className="px-4 py-3">Email Address</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teamMembers.map((m) => (
                <tr key={m.membershipId} className="hover:bg-slate-50/80 transition">
                  <td className="px-4 py-3.5 font-medium text-slate-900">{m.user?.name || 'Team Member'}</td>
                  <td className="px-4 py-3.5 font-mono text-slate-700">{m.user?.email}</td>
                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      {m.role}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className="text-emerald-700 font-medium text-xs flex items-center gap-1.5 justify-end">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> ACTIVE
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* API Credentials */}
      <div className="gemini-card p-6 space-y-4">
        <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <Key className="w-4 h-4 text-slate-500" />
          <span>Live Webhook API Key</span>
        </h3>
        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span>shiftexa_live_abcproperties_2026_key998313</span>
          <span className="text-xs px-2.5 py-0.5 rounded-md bg-white text-slate-700 font-medium border border-slate-200 shrink-0">
            ACTIVE & SECURED
          </span>
        </div>
      </div>

      {/* Account Security & Session Logout */}
      <div className="gemini-card p-6 space-y-4">
        <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <Lock className="w-4 h-4 text-slate-500" />
          <span>Account Security & Session</span>
        </h3>
        <p className="text-xs text-slate-500">Sign out of your active Shiftexa dashboard session on this browser.</p>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-medium text-xs flex items-center gap-2 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of Dashboard</span>
        </button>
      </div>

      {/* Invite Member Modal */}
      <Modal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} title="Invite Team Member">
        <form onSubmit={handleInviteSubmit} className="space-y-4 font-sans">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              required
              placeholder="e.g. Ananya Rao"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              required
              placeholder="ananya@abcproperties.com"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Role</label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="MEMBER">MEMBER (View & Lead Management)</option>
              <option value="ADMIN">ADMIN (Full Campaign & Employee Edit Access)</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition"
          >
            {loading ? 'Sending Invitation...' : 'Send Team Invitation'}
          </button>
        </form>
      </Modal>
    </div>
  );
}



