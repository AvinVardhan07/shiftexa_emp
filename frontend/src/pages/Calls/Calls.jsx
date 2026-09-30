import React, { useState, useEffect } from 'react';
import { PhoneCall, Play, FileText, CheckCircle2, Clock, Wallet, Zap, Volume2 } from 'lucide-react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';

export default function Calls() {
  const [calls, setCalls] = useState([]);
  const [selectedCall, setSelectedCall] = useState(null);

  useEffect(() => {
    fetchCalls();
  }, []);

  const fetchCalls = async () => {
    try {
      const res = await api.get('/calls');
      if (res.data.success) {
        setCalls(res.data.calls || []);
      }
    } catch (err) {
      console.warn('Calls fetch fallback:', err.message);
      setCalls([
        {
          _id: 'call_101',
          employeeId: { name: 'Meera (Real Estate Sales)' },
          leadId: { name: 'Rahul Sharma', phone: '+91 98765 43210' },
          direction: 'OUTBOUND',
          status: 'COMPLETED',
          durationSeconds: 138,
          billedMinutes: 3,
          costPerMin: 3.50,
          totalCost: 10.50,
          summary: 'Customer Rahul enquired about 3BHK in Gachibowli (Budget ~₹1.5 Cr). Expressed price hesitation and parents medical proximity requirements. Meera provided consultative guidance and successfully booked a site visit for Sunday 11:00 AM. Sent WhatsApp brochure.',
          outcome: 'QUALIFIED_SITE_VISIT_BOOKED',
          transcript: [
            { speaker: 'Meera', text: 'Hello Rahul garu, nenu Meera maatladutunnanu ABC Properties nunchi. Meeru Gachibowli lo 3BHK kosam enquiry chesaru kada?', timestamp: '00:02' },
            { speaker: 'Customer', text: 'Avunu. Kaani price konchem ekkuva anipisthundi.', timestamp: '00:08' },
            { speaker: 'Meera', text: 'Avunu Rahul garu, ardham ayyindi. Meeru budget ni carefully plan cheskuntunnaru kabatti price important factor ani naaku ardham avuthundi. Mee budget around 1.5 crore kada?', timestamp: '00:18' },
            { speaker: 'Customer', text: '1.5 is comfortable. Actually family and parents kosam chusthunna.', timestamp: '00:30' },
            { speaker: 'Meera', text: 'Then Gachibowli location meeku highly useful avvachu. Financial district and major hospitals nearby. Sunday comfortable ga unte site visit arrange cheddama?', timestamp: '00:48' },
            { speaker: 'Customer', text: 'Okay, Sunday 11 AM works.', timestamp: '01:02' },
            { speaker: 'Meera', text: 'Perfect Rahul garu! Sunday 11:00 AM ki site visit booked. WhatsApp lo location link pampinchanu. Thank you!', timestamp: '01:15' }
          ]
        }
      ]);
    }
  };

  const activeCallModal = selectedCall || calls[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Call History & Transcripts</h1>
        <p className="text-slate-500 text-sm mt-0.5">Review voice interactions, transcripts, summaries, and outcomes.</p>
      </div>

      {/* Main Grid: Call List & Detail Viewer */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Call History List */}
        <div className="lg:col-span-1 bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Completed Sessions</h3>

          {calls.map((c) => (
            <div
              key={c._id}
              onClick={() => setSelectedCall(c)}
              className={`p-3.5 rounded-lg border transition cursor-pointer ${
                activeCallModal?._id === c._id
                  ? 'bg-blue-50/70 border-blue-600 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-slate-900 text-sm">{c.leadId?.name || 'Rahul Sharma'}</span>
                <span className="text-xs font-mono text-slate-700 font-semibold">₹{(c.totalCost || 10.5).toFixed(2)}</span>
              </div>
              <div className="text-xs text-slate-500 flex items-center justify-between mb-2">
                <span>{c.leadId?.phone || '+91 98765 43210'}</span>
                <span>{Math.ceil((c.durationSeconds || 138) / 60)} mins</span>
              </div>
              <Badge status={c.outcome || 'QUALIFIED_SITE_VISIT_BOOKED'} />
            </div>
          ))}
        </div>

        {/* Right Column: Selected Call Detail & Diarized Transcript */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
          {activeCallModal ? (
            <>
              {/* Call Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-slate-900">{activeCallModal.leadId?.name || 'Rahul Sharma'}</h2>
                    <Badge status={activeCallModal.outcome || 'QUALIFIED_SITE_VISIT_BOOKED'} />
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Employee: <strong className="text-blue-600 font-medium">{activeCallModal.employeeId?.name || 'Meera'}</strong> • Phone: <span className="font-mono text-slate-700">{activeCallModal.leadId?.phone || '+91 98765 43210'}</span>
                  </div>
                </div>

                <div className="text-right font-mono text-xs text-slate-600 space-y-0.5">
                  <div>Duration: <strong>{activeCallModal.durationSeconds || 138}s ({activeCallModal.billedMinutes || 3} mins)</strong></div>
                  <div>Cost Charged: <strong className="text-blue-600">₹{(activeCallModal.totalCost || 10.5).toFixed(2)} (@ ₹3.5/min)</strong></div>
                </div>
              </div>

              {/* Audio Player Simulation */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-4">
                <button className="w-9 h-9 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition shrink-0">
                  <Play className="w-4 h-4 fill-current" />
                </button>
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-slate-500 mb-1 font-mono">
                    <span>00:00</span>
                    <span>02:18</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full w-1/3"></div>
                  </div>
                </div>
              </div>

              {/* Summary Card */}
              <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-100 text-xs leading-relaxed space-y-1">
                <div className="font-semibold text-blue-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5 mb-1">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  Call Summary & Extracted Data
                </div>
                <p className="text-slate-700">{activeCallModal.summary}</p>
              </div>

              {/* Diarized Transcript */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Diarized Transcript</h4>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3 max-h-80 overflow-y-auto">
                  {activeCallModal.transcript?.map((line, idx) => (
                    <div key={idx} className={`flex flex-col ${line.speaker === 'Meera' ? 'items-start' : 'items-end'}`}>
                      <span className="text-[10px] text-slate-400 mb-0.5 font-mono">{line.speaker} • {line.timestamp}</span>
                      <div className={`max-w-[85%] px-3.5 py-2 rounded-lg text-xs leading-relaxed ${
                        line.speaker === 'Meera'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-slate-800 border border-slate-200 shadow-xs'
                      }`}>
                        {line.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-slate-400 py-12 text-sm">Select a call to view full transcript</div>
          )}
        </div>
      </div>
    </div>
  );
}

