import React, { useState, useEffect } from 'react';
import { PhoneCall, Play, Square, FileText, Check, Clock, Wallet, Zap, Calendar, MessageSquare, ArrowUpRight } from 'lucide-react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';

export default function Calls() {
  const [calls, setCalls] = useState([]);
  const [selectedCall, setSelectedCall] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

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

  const handleAudioPlaybackToggle = () => {
    if (!('speechSynthesis' in window)) return;
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      const text = activeCallModal?.summary || "Hello sir, nenu Meera maatladutunnanu ABC Properties nunchi.";
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const activeCallModal = selectedCall || calls[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Call History & Transcripts</h1>
        <p className="text-sm text-slate-500 mt-1">Review voice interactions, transcripts, summaries, and lead outcomes.</p>
      </div>

      {/* Main Grid: Call List & Detail Viewer */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Call History List */}
        <div className="lg:col-span-1 gemini-card p-5 space-y-3">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Completed Sessions</h3>

          {calls.map((c) => (
            <div
              key={c._id}
              onClick={() => setSelectedCall(c)}
              className={`p-3.5 rounded-xl border transition cursor-pointer ${
                activeCallModal?._id === c._id
                  ? 'bg-slate-50 border-blue-500 shadow-xs'
                  : 'bg-white border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-slate-900 text-xs">{c.leadId?.name || 'Rahul Sharma'}</span>
                <span className="text-xs font-medium text-slate-700">₹{(c.totalCost || 10.5).toFixed(2)}</span>
              </div>
              <div className="text-xs text-slate-500 flex items-center justify-between mb-2">
                <span className="font-mono">{c.leadId?.phone || '+91 98765 43210'}</span>
                <span>{Math.ceil((c.durationSeconds || 138) / 60)} mins</span>
              </div>
              <Badge status={c.outcome || 'QUALIFIED_SITE_VISIT_BOOKED'} />
            </div>
          ))}
        </div>

        {/* Right Column: Selected Call Detail & Diarized Transcript */}
        <div className="lg:col-span-2 gemini-card p-6 md:p-7 space-y-6">
          {activeCallModal ? (
            <>
              {/* Call Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold text-slate-900">{activeCallModal.leadId?.name || 'Rahul Sharma'}</h2>
                    <Badge status={activeCallModal.outcome || 'QUALIFIED_SITE_VISIT_BOOKED'} />
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Representative: <span className="text-slate-800 font-medium">{activeCallModal.employeeId?.name || 'Meera'}</span> • Phone: <span className="font-mono text-slate-800 font-medium">{activeCallModal.leadId?.phone || '+91 98765 43210'}</span>
                  </div>
                </div>

                <div className="text-right text-xs text-slate-500 space-y-0.5">
                  <div>Duration: <span className="text-slate-900 font-medium">{activeCallModal.durationSeconds || 138}s ({activeCallModal.billedMinutes || 3} mins)</span></div>
                  <div>Cost: <span className="text-slate-900 font-medium">₹{(activeCallModal.totalCost || 10.5).toFixed(2)} (@ ₹3.50/min)</span></div>
                </div>
              </div>

              {/* Audio Player Simulation */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-4">
                <button
                  onClick={handleAudioPlaybackToggle}
                  className="w-9 h-9 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition shrink-0"
                >
                  {isPlayingAudio ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-slate-500 mb-1 font-mono">
                    <span>{isPlayingAudio ? '01:05' : '00:00'}</span>
                    <span>02:18</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className={`bg-blue-600 h-full transition-all duration-300 rounded-full ${isPlayingAudio ? 'w-1/2' : 'w-0'}`}></div>
                  </div>
                </div>
              </div>

              {/* Summary Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-3">
                <div className="font-semibold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span>Call Summary & Dispatch Log</span>
                </div>
                <p className="text-slate-600 leading-relaxed font-normal">{activeCallModal.summary}</p>

                <div className="flex flex-wrap gap-2.5 pt-2 border-t border-slate-200">
                  <a
                    href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Site+Visit+-+Gachibowli+Heights&dates=20261004T053000Z/20261004T063000Z&details=Site+Visit+booked+by+Meera+AI&location=Gachibowli+Hyderabad"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium text-xs transition inline-flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>View Calendar Event</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-400" />
                  </a>
                  <a
                    href="https://wa.me/919876543210?text=Hi%20Rahul,%20your%20Gachibowli%20Heights%20Site%20Visit%20is%20confirmed."
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-medium text-xs transition inline-flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>View WhatsApp Dispatch</span>
                    <ArrowUpRight className="w-3 h-3 text-emerald-600" />
                  </a>
                </div>
              </div>

              {/* Diarized Transcript */}
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Diarized Transcript</h3>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3 max-h-80 overflow-y-auto">
                  {activeCallModal.transcript?.map((line, idx) => (
                    <div key={idx} className={`flex flex-col ${line.speaker === 'Meera' ? 'items-start' : 'items-end'}`}>
                      <span className="text-[10px] text-slate-400 mb-0.5 font-medium">{line.speaker} • {line.timestamp}</span>
                      <div className={`max-w-[85%] px-3.5 py-2.5 rounded-lg text-xs leading-relaxed font-normal ${
                        line.speaker === 'Meera'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-slate-900 border border-slate-200 shadow-xs'
                      }`}>
                        {line.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-slate-500 py-12 text-sm font-normal">Select a call session to view full diarized transcript</div>
          )}
        </div>
      </div>
    </div>
  );
}


