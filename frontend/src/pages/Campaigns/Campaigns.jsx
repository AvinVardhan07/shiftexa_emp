import React, { useState, useEffect } from 'react';
import { Radio, Plus, Play, CheckCircle2, PhoneCall, Calendar } from 'lucide-react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    fetchCampaigns();
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Outbound Campaigns</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage automated voice campaigns and lead dispatch queues.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {campaigns.map((c) => (
          <div key={c._id} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">{c.name}</h3>
              <Badge status={c.status} />
            </div>

            <div className="grid grid-cols-3 gap-3 p-4 rounded-lg bg-slate-50 border border-slate-200 text-center text-xs">
              <div>
                <span className="text-slate-500 block">Total Leads</span>
                <span className="font-bold text-slate-900 text-base">{c.totalLeads}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Completed</span>
                <span className="font-bold text-blue-600 text-base">{c.completedCalls}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Site Visits</span>
                <span className="font-bold text-slate-900 text-base">{c.successfulBookings}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

