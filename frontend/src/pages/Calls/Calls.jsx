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
        <h1 className="text-2xl font-bold text-[#1F1F1F] tracking-tight">Call History & Transcripts</h1>
        <p className="text-[#5F6368] text-xs sm:text-sm mt-0.5">Review voice interactions, transcripts, summaries, and lead outcomes.</p>
      </div>

      {/* Main Grid: Call List & Detail Viewer */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Call History List */}
        <div className="lg:col-span-1 gemini-card p-5 space-y-3">
          <h3 className="text-xs font-semibold text-[#5F6368] uppercase tracking-wider mb-2">Completed Call Sessions</h3>

          {calls.map((c) => (
            <div
              key={c._id}
              onClick={() => setSelectedCall(c)}
              className={`p-4 rounded-2xl border transition cursor-pointer ${
                activeCallModal?._id === c._id
                  ? 'bg-[#E8F0FE] border-[#1A73E8]'
                  : 'bg-white border-[#E3E3E3] hover:border-[#747775]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-[#1F1F1F] text-xs">{c.leadId?.name || 'Rahul Sharma'}</span>
                <span className="text-xs font-mono text-[#1A73E8] font-bold">₹{(c.totalCost || 10.5).toFixed(2)}</span>
              </div>
              <div className="text-xs text-[#5F6368] flex items-center justify-between mb-2 font-mono">
                <span>{c.leadId?.phone || '+91 98765 43210'}</span>
                <span>{Math.ceil((c.durationSeconds || 138) / 60)} mins</span>
              </div>
              <Badge status={c.outcome || 'QUALIFIED_SITE_VISIT_BOOKED'} />
            </div>
          ))}
        </div>

        {/* Right Column: Selected Call Detail & Diarized Transcript */}
        <div className="lg:col-span-2 gemini-card p-6 md:p-8 space-y-6">
          {activeCallModal ? (
            <>
              {/* Call Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E3E3E3] pb-5">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-[#1F1F1F]">{activeCallModal.leadId?.name || 'Rahul Sharma'}</h2>
                    <Badge status={activeCallModal.outcome || 'QUALIFIED_SITE_VISIT_BOOKED'} />
                  </div>
                  <div className="text-xs text-[#5F6368] mt-1">
                    Representative: <strong className="text-[#1A73E8] font-semibold">{activeCallModal.employeeId?.name || 'Meera'}</strong> • Phone: <span className="font-mono text-[#1F1F1F]">{activeCallModal.leadId?.phone || '+91 98765 43210'}</span>
                  </div>
                </div>

                <div className="text-right font-mono text-xs text-[#5F6368] space-y-0.5">
                  <div>Duration: <strong className="text-[#1F1F1F]">{activeCallModal.durationSeconds || 138}s ({activeCallModal.billedMinutes || 3} mins)</strong></div>
                  <div>Cost Charged: <strong className="text-[#1A73E8]">₹{(activeCallModal.totalCost || 10.5).toFixed(2)} (@ ₹3.50/min)</strong></div>
                </div>
              </div>

              {/* Audio Player Simulation */}
              <div className="p-4 rounded-2xl bg-[#F0F4F9] border border-[#E3E3E3] flex items-center gap-4">
                <button
                  onClick={handleAudioPlaybackToggle}
                  className="w-10 h-10 rounded-full bg-[#1A73E8] hover:bg-[#1557B0] text-white flex items-center justify-center transition shrink-0 shadow-none"
                >
                  {isPlayingAudio ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-[#5F6368] mb-1 font-mono">
                    <span>{isPlayingAudio ? '01:05' : '00:00'}</span>
                    <span>02:18</span>
                  </div>
                  <div className="w-full bg-[#E3E3E3] h-2 rounded-full overflow-hidden">
                    <div className={`bg-[#1A73E8] h-full transition-all duration-300 rounded-full ${isPlayingAudio ? 'w-1/2' : 'w-0'}`}></div>
                  </div>
                </div>
              </div>

              {/* Summary Card */}
              <div className="p-5 rounded-2xl bg-[#E8F0FE] border border-[#D2E3FC] text-xs leading-relaxed space-y-3">
                <div className="font-bold text-[#1A73E8] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#1A73E8]" />
                  <span>AI Executive Call Summary & Trigger Logs</span>
                </div>
                <p className="text-[#1F1F1F] font-normal leading-relaxed">{activeCallModal.summary}</p>

                <div className="flex flex-wrap gap-3 pt-2 border-t border-[#D2E3FC]">
                  <a
                    href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Site+Visit+-+Gachibowli+Heights&dates=20261004T053000Z/20261004T063000Z&details=Site+Visit+booked+by+Meera+AI&location=Gachibowli+Hyderabad"
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-full bg-[#1A73E8] hover:bg-[#1557B0] text-white font-semibold text-xs transition inline-flex items-center gap-1.5 shadow-none"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>View Google Calendar Event</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                  <a
                    href="https://wa.me/919876543210?text=Hi%20Rahul,%20your%20Gachibowli%20Heights%20Site%20Visit%20is%20confirmed."
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-full bg-[#137333] hover:bg-[#0D6527] text-white font-semibold text-xs transition inline-flex items-center gap-1.5 shadow-none"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>View Meta WhatsApp Dispatch</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Diarized Transcript */}
              <div>
                <h3 className="text-xs font-bold text-[#5F6368] uppercase tracking-wider mb-3">Diarized Transcript</h3>
                <div className="p-4 rounded-2xl bg-[#F0F4F9] border border-[#E3E3E3] space-y-3 max-h-80 overflow-y-auto">
                  {activeCallModal.transcript?.map((line, idx) => (
                    <div key={idx} className={`flex flex-col ${line.speaker === 'Meera' ? 'items-start' : 'items-end'}`}>
                      <span className="text-[10px] text-[#5F6368] mb-0.5 font-mono">{line.speaker} • {line.timestamp}</span>
                      <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                        line.speaker === 'Meera'
                          ? 'bg-[#1A73E8] text-white rounded-tl-none font-normal'
                          : 'bg-white text-[#1F1F1F] border border-[#E3E3E3] rounded-tr-none font-normal shadow-xs'
                      }`}>
                        {line.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-[#5F6368] py-12 text-sm font-normal">Select a call session to view full diarized transcript</div>
          )}
        </div>
      </div>
    </div>
  );
}


