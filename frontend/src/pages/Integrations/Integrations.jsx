import React, { useState, useEffect } from 'react';
import { Zap, CheckCircle2, MessageSquare, Calendar, Globe, Share2 } from 'lucide-react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';

export default function Integrations() {
  const [integrations, setIntegrations] = useState([]);

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      const res = await api.get('/integrations');
      if (res.data.success) {
        setIntegrations(res.data.integrations || []);
      }
    } catch (err) {
      setIntegrations([
        {
          _id: 'int_wa',
          name: 'WhatsApp Business API (Meta)',
          type: 'WHATSAPP',
          status: 'CONNECTED',
          config: { phoneId: '+91 40 4892 1100', template: 'site_visit_confirmation' }
        },
        {
          _id: 'int_gcal',
          name: 'Google Calendar Site Visit Booking',
          type: 'GOOGLE_CALENDAR',
          status: 'CONNECTED',
          config: { calendarId: 'sales@abcproperties.com' }
        },
        {
          _id: 'int_webhook',
          name: 'Custom Lead Source Webhook API',
          type: 'CRM_WEBHOOK',
          status: 'CONNECTED',
          config: { webhookUrl: 'http://localhost:5000/api/webhooks/leads' }
        }
      ]);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Integrations & Connected Services</h1>
        <p className="text-slate-500 text-sm mt-0.5">Manage connections for WhatsApp Business, Google Calendar, and Webhooks.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {integrations.map((item) => (
          <div key={item._id} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <Zap className="w-4 h-4" />
              </div>
              <Badge status={item.status} />
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-base">{item.name}</h3>
              <p className="text-xs text-slate-500 mt-1 font-mono">{item.type}</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-700 overflow-x-auto">
              {JSON.stringify(item.config || {})}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

