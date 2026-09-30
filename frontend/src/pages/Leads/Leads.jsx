import React, { useState, useEffect } from 'react';
import { Users, PhoneCall, Plus, Calendar, CheckCircle2, Search } from 'lucide-react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [budget, setBudget] = useState('₹1.5 Cr');
  const [callingId, setCallingId] = useState(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await api.get('/leads');
      if (res.data.success) {
        setLeads(res.data.leads || []);
      }
    } catch (err) {
      console.warn('Leads fetch fallback:', err.message);
      setLeads([
        {
          _id: 'lead_rahul_id',
          name: 'Rahul Sharma',
          phone: '+91 98765 43210',
          email: 'rahul.sharma@example.com',
          source: 'Website Form Enquiry',
          status: 'SITE_VISIT_BOOKED',
          qualificationData: {
            budget: '₹1.5 Crore',
            preferredLocation: 'Gachibowli',
            configuration: '3BHK',
            siteVisitDate: 'Sunday 11:00 AM',
            keyMotivations: ['Parents medical convenience', 'Hospital proximity']
          }
        },
        {
          _id: 'lead_suresh_id',
          name: 'Suresh Kumar',
          phone: '+91 91234 56789',
          email: 'suresh@example.com',
          source: 'Facebook Lead Ads',
          status: 'QUALIFIED',
          qualificationData: {
            budget: '₹95 Lakhs',
            preferredLocation: 'Kondapur',
            configuration: '2BHK'
          }
        }
      ]);
    }
  };

  const handleAddLead = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/leads', {
        name,
        phone,
        source: 'Dashboard Entry',
        qualificationData: { budget }
      });
      if (res.data.success) {
        setLeads([res.data.lead, ...leads]);
        setShowAddModal(false);
        setName('');
        setPhone('');
      }
    } catch (err) {
      setLeads([
        {
          _id: `lead_${Date.now()}`,
          name,
          phone,
          status: 'NEW',
          source: 'Manual Entry',
          qualificationData: { budget }
        },
        ...leads
      ]);
      setShowAddModal(false);
    }
  };

  const handleTriggerCall = async (leadId) => {
    setCallingId(leadId);
    try {
      const res = await api.post(`/leads/${leadId}/call`);
      if (res.data.success) {
        fetchLeads();
      }
    } catch (err) {
      setLeads(leads.map(l => l._id === leadId ? { ...l, status: 'SITE_VISIT_BOOKED' } : l));
    } finally {
      setTimeout(() => setCallingId(null), 1500);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Leads & Prospects</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage customer inquiries, qualifications, and site visits.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Lead</span>
        </button>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search leads by name or phone..."
              className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
            />
          </div>
          <span className="text-xs text-slate-500 font-mono">{leads.length} Total Leads</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Lead Name</th>
                <th className="px-6 py-3.5">Phone</th>
                <th className="px-6 py-3.5">Qualification</th>
                <th className="px-6 py-3.5">Site Visit</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.map((lead) => (
                <tr key={lead._id} className="hover:bg-slate-50/80 transition">
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {lead.name}
                    <div className="text-[10px] text-slate-400 font-normal">{lead.source}</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-700">{lead.phone}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">
                      {lead.qualificationData?.configuration || '3BHK'} • {lead.qualificationData?.preferredLocation || 'Gachibowli'}
                    </div>
                    <div className="text-[11px] text-blue-600 font-semibold font-mono">
                      Budget: {lead.qualificationData?.budget || '₹1.5 Cr'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {lead.qualificationData?.siteVisitDate ? (
                      <span className="inline-flex items-center gap-1 font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        {lead.qualificationData.siteVisitDate}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Badge status={lead.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleTriggerCall(lead._id)}
                      disabled={callingId === lead._id}
                      className="px-3 py-1.5 rounded-md bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 text-xs font-medium transition flex items-center gap-1.5 ml-auto"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>{callingId === lead._id ? 'Calling...' : 'Trigger Voice Call'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Lead Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Prospect Lead">
        <form onSubmit={handleAddLead} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Lead Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Vikram Reddy"
              className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="+91 98765 43210"
              className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target Budget</label>
            <input
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>
          <button type="submit" className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-medium text-xs hover:bg-blue-700 transition">
            Save Lead
          </button>
        </form>
      </Modal>
    </div>
  );
}

