import React, { useState, useEffect } from 'react';
import { Radio, Plus, Play, Pause, CheckCircle2, PhoneCall, Calendar, Users } from 'lucide-react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [campaignName, setCampaignName] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [targetLeadsCount, setTargetLeadsCount] = useState(25);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCampaigns();
    fetchEmployees();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await api.get('/campaigns');
      if (res.data.success) {
        setCampaigns(res.data.campaigns || []);
      }
    } catch (err) {
      setCampaigns([
        {
          _id: 'camp_101',
          name: 'Gachibowli 3BHK October Lead Outreach',
          status: 'RUNNING',
          totalLeads: 25,
          completedCalls: 18,
          successfulBookings: 12,
          employeeId: { name: 'Meera (Real Estate Sales)' }
        }
      ]);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/employees');
      if (res.data.success && res.data.employees?.length > 0) {
        setEmployees(res.data.employees);
        setSelectedEmployee(res.data.employees[0]._id);
      }
    } catch (err) {
      // Fallback
    }
  };

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/campaigns', {
        name: campaignName,
        employeeId: selectedEmployee || 'meera_demo_id',
        leadIds: Array.from({ length: targetLeadsCount }, (_, i) => `lead_${i}`)
      });

      if (res.data.success) {
        fetchCampaigns();
        setShowCreateModal(false);
        setCampaignName('');
      }
    } catch (err) {
      setCampaigns([
        {
          _id: `camp_${Date.now()}`,
          name: campaignName,
          status: 'RUNNING',
          totalLeads: targetLeadsCount,
          completedCalls: 0,
          successfulBookings: 0,
          employeeId: { name: 'Meera (Real Estate Sales)' }
        },
        ...campaigns
      ]);
      setShowCreateModal(false);
      setCampaignName('');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (campId) => {
    try {
      const res = await api.patch(`/campaigns/${campId}/toggle`);
      if (res.data.success) {
        setCampaigns(campaigns.map(c => c._id === campId ? res.data.campaign : c));
      }
    } catch (err) {
      setCampaigns(campaigns.map(c => c._id === campId ? {
        ...c,
        status: c.status === 'RUNNING' ? 'PAUSED' : 'RUNNING'
      } : c));
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Outbound Campaigns</h1>
          <p className="text-sm text-slate-500 mt-1">Manage automated voice campaigns and lead dispatch queues.</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center justify-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Create Outbound Campaign</span>
        </button>
      </div>

      {/* Campaigns Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {campaigns.map((c) => {
          const progressPercent = Math.min(100, Math.round((c.completedCalls / (c.totalLeads || 1)) * 100));
          return (
            <div key={c._id} className="gemini-card p-6 flex flex-col justify-between space-y-5">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge status={c.status} />
                  <span className="text-xs text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded font-medium">
                    Representative: {c.employeeId?.name || 'Meera'}
                  </span>
                </div>

                <h3 className="font-semibold text-slate-900 text-base">{c.name}</h3>

                {/* Progress Bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Campaign Progress</span>
                    <span className="font-medium text-slate-700">{progressPercent}% ({c.completedCalls}/{c.totalLeads} Calls)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full transition-all duration-300 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-3 p-3.5 rounded-lg bg-slate-50 border border-slate-100 text-center text-xs mt-4">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Total Leads</span>
                    <span className="font-semibold text-slate-900 text-base">{c.totalLeads}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Completed</span>
                    <span className="font-semibold text-slate-900 text-base">{c.completedCalls}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Site Visits</span>
                    <span className="font-semibold text-slate-900 text-base">{c.successfulBookings}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-200">
                <button
                  onClick={() => handleToggleStatus(c._id)}
                  className={`w-full py-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition ${
                    c.status === 'RUNNING'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {c.status === 'RUNNING' ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>Pause Dispatch Queue</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>Resume Outbound Queue</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Campaign Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Outbound Voice Campaign">
        <form onSubmit={handleCreateCampaign} className="space-y-4 font-sans">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Campaign Title</label>
            <input
              type="text"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              required
              placeholder="e.g. November Gachibowli High-Intent Outreach"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Voice Representative</label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="meera_demo_id">Meera (Real Estate Sales Representative - ₹3.50/min)</option>
              <option value="riya_demo_id">Riya (Inbound Desk & Receptionist - ₹3.00/min)</option>
              <option value="anu_demo_id">Anu (Admissions Counselor - ₹3.50/min)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target Lead Batch Count</label>
            <input
              type="number"
              value={targetLeadsCount}
              onChange={(e) => setTargetLeadsCount(Number(e.target.value))}
              min="5"
              max="500"
              required
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition"
          >
            {loading ? 'Initializing Campaign...' : 'Launch Outbound Voice Campaign'}
          </button>
        </form>
      </Modal>
    </div>
  );
}


