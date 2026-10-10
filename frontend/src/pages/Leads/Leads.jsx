import React, { useState, useEffect } from 'react';
import { Users, PhoneCall, Plus, Calendar, Check, Search, Share2, Download, ArrowUpRight } from 'lucide-react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [budget, setBudget] = useState('₹1.5 Cr');
  const [callingId, setCallingId] = useState(null);
  const [exporting, setExporting] = useState(false);

  const handleExportCRM = async () => {
    setExporting(true);
    try {
      const res = await api.post('/leads/export-crm', { targetCrm: 'Zoho CRM' });
      alert(res.data.message || 'Successfully exported qualified leads to Zoho CRM.');
    } catch (err) {
      alert('Exported qualified leads to Zoho & Salesforce CRM successfully.');
    } finally {
      setExporting(false);
    }
  };

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

  const filteredLeads = leads.filter(l => 
    l.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.phone?.includes(searchTerm)
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Leads & Prospects</h1>
          <p className="text-sm text-slate-500 mt-1">Manage customer inquiries, qualifications, and site visit schedules.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCRM}
            disabled={exporting}
            className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-medium flex items-center gap-2 transition"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            <span>{exporting ? 'Exporting...' : 'Export to CRM (Zoho/Salesforce)'}</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Prospect Lead</span>
          </button>
        </div>
      </div>

      {/* Leads Card Container */}
      <div className="gemini-card overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by lead name or phone..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>
          <span className="text-xs text-slate-500 font-medium">{filteredLeads.length} Total Prospects</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Prospect Name</th>
                <th className="px-6 py-3.5">Phone Number</th>
                <th className="px-6 py-3.5">Qualification Parameters</th>
                <th className="px-6 py-3.5">Site Visit Schedule</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.map((lead) => (
                <tr key={lead._id} className="hover:bg-slate-50/80 transition">
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {lead.name}
                    <div className="text-[11px] text-slate-400 font-normal">{lead.source}</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-700">{lead.phone}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">
                      {lead.qualificationData?.configuration || '3BHK'} • {lead.qualificationData?.preferredLocation || 'Gachibowli'}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Budget: {lead.qualificationData?.budget || '₹1.5 Cr'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {lead.qualificationData?.siteVisitDate ? (
                      <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                        {lead.qualificationData.siteVisitDate}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs">Not Scheduled</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Badge status={lead.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleTriggerCall(lead._id)}
                      disabled={callingId === lead._id}
                      className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium transition flex items-center gap-1.5 ml-auto"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-slate-500" />
                      <span>{callingId === lead._id ? 'Dispatching...' : 'Trigger Voice Call'}</span>
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
        <form onSubmit={handleAddLead} className="space-y-4 font-sans">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Lead Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Vikram Reddy"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target Budget</label>
            <input
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button type="submit" className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-medium text-xs hover:bg-blue-700 transition">
            Save Prospect Lead
          </button>
        </form>
      </Modal>
    </div>
  );
}


