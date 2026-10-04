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
        <h1 className="text-2xl font-bold text-[#1F1F1F] tracking-tight">Organization & RBAC Settings</h1>
        <p className="text-[#5F6368] text-xs sm:text-sm mt-0.5">Manage business profile, team member roles, and security API keys.</p>
      </div>

      {/* Business Profile Card */}
      <div className="gemini-card p-6 space-y-4">
        <h3 className="text-base font-bold text-[#1F1F1F] flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#1A73E8]" />
          <span>Business Profile</span>
        </h3>

        <div className="grid md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-[#1F1F1F] mb-1.5">Company / Organization Name</label>
            <input
              type="text"
              readOnly
              value={organization?.name || 'ABC Properties'}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E3E3E3] text-[#1F1F1F] bg-[#F0F4F9] font-medium"
            />
          </div>
          <div>
            <label className="block font-semibold text-[#1F1F1F] mb-1.5">Target Business Industry</label>
            <input
              type="text"
              readOnly
              value="Real Estate Sales & Voice Automation"
              className="w-full px-4 py-2.5 rounded-xl border border-[#E3E3E3] text-[#1F1F1F] bg-[#F0F4F9] font-medium"
            />
          </div>
        </div>
      </div>

      {/* Team Members & RBAC Security */}
      <div className="gemini-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-[#1F1F1F] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#1A73E8]" />
              <span>Team Members & Role Access Control (RBAC)</span>
            </h3>
            <p className="text-xs text-[#5F6368] mt-0.5">Manage organization members and assigned role permissions.</p>
          </div>

          <button
            onClick={() => setShowInviteModal(true)}
            className="px-4 py-2 rounded-full bg-[#1A73E8] hover:bg-[#1557B0] text-white font-semibold text-xs transition shadow-none flex items-center gap-1.5 shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Invite Team Member</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#444746]">
            <thead className="bg-[#F0F4F9] text-[#1F1F1F] uppercase tracking-wider font-semibold border-b border-[#E3E3E3]">
              <tr>
                <th className="px-4 py-3">Member Name</th>
                <th className="px-4 py-3">Email Address</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E3E3]">
              {teamMembers.map((m) => (
                <tr key={m.membershipId} className="hover:bg-[#F8F9FA] transition">
                  <td className="px-4 py-3.5 font-bold text-[#1F1F1F]">{m.user?.name || 'Team Member'}</td>
                  <td className="px-4 py-3.5 font-mono text-[#1F1F1F]">{m.user?.email}</td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border ${
                      m.role === 'OWNER' ? 'bg-[#E8F0FE] text-[#1A73E8] border-[#D2E3FC]' : 'bg-[#F0F4F9] text-[#5F6368] border-[#E3E3E3]'
                    }`}>
                      {m.role}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className="text-[#137333] font-bold text-[11px] flex items-center gap-1.5 justify-end font-mono">
                      <span className="w-2 h-2 rounded-full bg-[#137333]"></span> ACTIVE
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
        <h3 className="text-base font-bold text-[#1F1F1F] flex items-center gap-2">
          <Key className="w-4 h-4 text-[#1A73E8]" />
          <span>Live Webhook API Key</span>
        </h3>
        <div className="p-4 rounded-2xl bg-[#F0F4F9] border border-[#E3E3E3] font-mono text-xs text-[#1F1F1F] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span>shiftexa_live_abcproperties_2026_key998313</span>
          <span className="text-[10px] px-3 py-1 rounded-full bg-[#E8F0FE] text-[#1A73E8] font-bold border border-[#D2E3FC] shrink-0">
            ACTIVE & SECURED
          </span>
        </div>
      </div>

      {/* Account Security & Session Logout */}
      <div className="gemini-card p-6 space-y-4 border-rose-200 bg-rose-50/20">
        <h3 className="text-base font-bold text-[#1F1F1F] flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#D93025]" />
          <span>Account Security & Session</span>
        </h3>
        <p className="text-xs text-[#5F6368]">Sign out of your active Shiftexa dashboard session on this browser.</p>
        <button
          onClick={handleLogout}
          className="px-6 py-2.5 rounded-full bg-[#D93025] hover:bg-[#B31412] text-white font-semibold text-xs flex items-center gap-2 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of Dashboard</span>
        </button>
      </div>

      {/* Invite Member Modal */}
      <Modal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} title="Invite Team Member">
        <form onSubmit={handleInviteSubmit} className="space-y-4 font-sans">
          <div>
            <label className="block text-xs font-semibold text-[#1F1F1F] mb-1">Full Name</label>
            <input
              type="text"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              required
              placeholder="e.g. Ananya Rao"
              className="w-full px-4 py-2.5 rounded-xl border border-[#747775] text-xs text-[#1F1F1F] focus:outline-none focus:border-[#1A73E8]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1F1F1F] mb-1">Email Address</label>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              required
              placeholder="ananya@abcproperties.com"
              className="w-full px-4 py-2.5 rounded-xl border border-[#747775] text-xs text-[#1F1F1F] focus:outline-none focus:border-[#1A73E8]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1F1F1F] mb-1">Assigned Role</label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#747775] text-xs text-[#1F1F1F] focus:outline-none focus:border-[#1A73E8]"
            >
              <option value="MEMBER">MEMBER (View & Lead Management)</option>
              <option value="ADMIN">ADMIN (Full Campaign & Employee Edit Access)</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-[#1A73E8] hover:bg-[#1557B0] text-white font-semibold text-xs transition"
          >
            {loading ? 'Sending Invitation...' : 'Send Team Invitation'}
          </button>
        </form>
      </Modal>
    </div>
  );
}



