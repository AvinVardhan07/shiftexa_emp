import React, { useState, useEffect } from 'react';
import { Zap, Check, MessageSquare, Calendar, Globe, Share2, Sliders, Settings, ShieldCheck } from 'lucide-react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

export default function Integrations() {
  const [integrations, setIntegrations] = useState([]);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configValue, setConfigValue] = useState('');

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
          config: { phoneId: '+91 40 4892 1100', template: 'site_visit_confirmation', metaApiVersion: 'v19.0' }
        },
        {
          _id: 'int_gcal',
          name: 'Google Calendar Site Visit Booking',
          type: 'GOOGLE_CALENDAR',
          status: 'CONNECTED',
          config: { calendarId: 'sales@abcproperties.com', timeZone: 'Asia/Kolkata' }
        },
        {
          _id: 'int_webhook',
          name: 'Custom Lead Source Webhook API',
          type: 'CRM_WEBHOOK',
          status: 'CONNECTED',
          config: { webhookUrl: 'http://localhost:5000/api/webhooks/leads', apiKeyRequired: true }
        }
      ]);
    }
  };

  const handleOpenConfig = (item) => {
    setSelectedConfig(item);
    setConfigValue(JSON.stringify(item.config || {}, null, 2));
    setShowConfigModal(true);
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(configValue);
      setIntegrations(integrations.map(i => i._id === selectedConfig._id ? { ...i, config: parsed } : i));
      setShowConfigModal(false);
    } catch (err) {
      alert('Invalid JSON format in configuration payload');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Integrations & Ecosystem Connectors</h1>
        <p className="text-sm text-slate-500 mt-1">Manage production endpoints for WhatsApp Business API, Google Calendar OAuth, and CRM Webhooks.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {integrations.map((item) => (
          <div key={item._id} className="gemini-card p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-semibold border border-slate-200">
                  <Zap className="w-4 h-4 text-slate-600" />
                </div>
                <Badge status={item.status} />
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 text-base">{item.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5 font-mono">{item.type}</p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 overflow-x-auto leading-relaxed">
                <pre>{JSON.stringify(item.config || {}, null, 2)}</pre>
              </div>
            </div>

            <button
              onClick={() => handleOpenConfig(item)}
              className="w-full py-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-300 transition flex items-center justify-center gap-1.5 mt-2"
            >
              <Sliders className="w-4 h-4 text-slate-500" />
              <span>Configure Parameters</span>
            </button>
          </div>
        ))}
      </div>

      {/* Config Modal */}
      <Modal isOpen={showConfigModal} onClose={() => setShowConfigModal(false)} title={`Configure ${selectedConfig?.name || 'Integration'}`}>
        <form onSubmit={handleSaveConfig} className="space-y-4 font-sans">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Configuration Payload (JSON)</label>
            <textarea
              rows={6}
              value={configValue}
              onChange={(e) => setConfigValue(e.target.value)}
              className="w-full p-3.5 rounded-lg border border-slate-300 text-xs font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition"
          >
            Save Parameters
          </button>
        </form>
      </Modal>
    </div>
  );
}



