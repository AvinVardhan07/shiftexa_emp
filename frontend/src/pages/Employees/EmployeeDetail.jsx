import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  PhoneCall, 
  ShieldCheck, 
  Play, 
  Square, 
  Send, 
  CheckCircle2, 
  Plus, 
  Building2, 
  MessageSquare, 
  FileText, 
  Sliders, 
  History,
  Volume2,
  Zap,
  Globe,
  Mic,
  MicOff,
  ExternalLink,
  Calendar
} from 'lucide-react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';
import WaveformVisualizer from '../../components/common/WaveformVisualizer';
import Modal from '../../components/common/Modal';

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [knowledgeBase, setKnowledgeBase] = useState(null);
  const [versions, setVersions] = useState([]);
  const [activeTab, setActiveTab] = useState('STUDIO'); // STUDIO, BRAIN, VOICE, VERSIONS

  // Test Call Simulator State
  const [callActive, setCallActive] = useState(false);
  const [callId, setCallId] = useState(null);
  const [transcript, setTranscript] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callToolAlert, setCallToolAlert] = useState(null);
  const [callCompleted, setCallCompleted] = useState(false);

  // Property Form Modal State
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [propTitle, setPropTitle] = useState('');
  const [propPrice, setPropPrice] = useState('₹1.5 Cr');
  const [propLocation, setPropLocation] = useState('Gachibowli, Hyderabad');
  const [propConfig, setPropConfig] = useState('3BHK');

  useEffect(() => {
    fetchEmployeeDetail();
  }, [id]);

  const fetchEmployeeDetail = async () => {
    try {
      const res = await api.get(`/employees/${id}`);
      if (res.data.success) {
        setEmployee(res.data.employee);
        setKnowledgeBase(res.data.knowledgeBase);
        setVersions(res.data.versions || []);
      }
    } catch (err) {
      console.warn('Fallback detail setup:', err.message);
      setEmployee({
        _id: id || 'meera_hired_id',
        name: 'Meera (Real Estate Sales)',
        status: 'LIVE',
        takingCalls: true,
        phoneNumber: '+91 40 4892 1100',
        currentDraftVersion: 1,
        configuration: {
          language: 'Telugu + English (Hyderabad)',
          regionalStyle: 'Hyderabad Casual Professional',
          formality: 'Casual Professional',
          salesApproach: 'Consultative & Helpful',
          greeting: 'Hello sir, nenu Meera maatladutunnanu ABC Properties nunchi. Meeru Gachibowli lo 3BHK kosam enquiry chesaru kada?'
        },
        stats: { totalCalls: 12, totalMinutes: 28, qualifiedLeads: 9, siteVisitsBooked: 6 }
      });

      setKnowledgeBase({
        businessName: 'ABC Properties',
        properties: [
          {
            title: 'Gachibowli Heights',
            location: 'Gachibowli, Hyderabad',
            configurationType: '3BHK',
            priceStarting: '₹1.5 Cr',
            amenities: ['Clubhouse', 'Swimming Pool', 'EV Charging', '24/7 Security'],
            description: 'Luxury 3BHK high-rise apartments near Financial District with 80% open green space.'
          },
          {
            title: 'Kondapur Luxury Residency',
            location: 'Kondapur, Hyderabad',
            configurationType: '2BHK & 3BHK',
            priceStarting: '₹95 Lakhs',
            amenities: ['Gym', 'Children Play Area', 'Power Backup'],
            description: 'Modern gated community close to Google & Botanical Garden.'
          }
        ]
      });
    }
  };

  const [isListening, setIsListening] = useState(false);

  // Speech Synthesis TTS engine
  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    // Pick Indian female/Telugu English accent if available
    const voices = window.speechSynthesis.getVoices();
    const teVoice = voices.find(v => v.lang.includes('te') || v.lang.includes('hi') || v.name.toLowerCase().includes('india'));
    if (teVoice) utterance.voice = teVoice;

    setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Web Speech STT Microphone toggle
  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported by your browser. Please type your message.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcriptText = event.results[0][0].transcript;
      setUserInput(transcriptText);
      setIsListening(false);
      handleSendSpeech(transcriptText);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const handleStartTestCall = async () => {
    setCallActive(true);
    setCallCompleted(false);
    setCallToolAlert(null);

    let initialGreeting = employee?.configuration?.greeting || 'Hello sir, nenu Meera maatladutunnanu ABC Properties nunchi. Meeru Gachibowli lo 3BHK kosam enquiry chesaru kada?';

    try {
      const res = await api.post(`/employees/${employee._id || id}/test-call`);
      if (res.data.success) {
        setCallId(res.data.callId);
        initialGreeting = res.data.initialGreeting || initialGreeting;
      }
    } catch (err) {
      setCallId('mock_call_101');
    } finally {
      setTranscript([{ speaker: 'Meera', text: initialGreeting }]);
      speakText(initialGreeting);
    }
  };

  const handleSendSpeech = async (overrideText = null) => {
    const textToSend = overrideText || userInput;
    if (!textToSend.trim()) return;

    setUserInput('');

    const updatedTranscript = [...transcript, { speaker: 'Customer', text: textToSend }];
    setTranscript(updatedTranscript);

    try {
      const res = await api.post('/employees/test-call/interact', {
        callId,
        message: textToSend
      });

      if (res.data.success) {
        setTranscript(res.data.transcript);
        speakText(res.data.reply);
        if (res.data.actionTriggered === 'BOOK_SITE_VISIT_AND_WHATSAPP') {
          setCallToolAlert('Action Triggered: Google Calendar Site Visit Booked for Sunday 11 AM + WhatsApp Brochure Sent!');
        }
        if (res.data.isCompleted) {
          setCallCompleted(true);
        }
      }
    } catch (err) {
      let reply = "Sure sir! Mee requirement prakaram Gachibowli project options review chesa. Sunday comfortable ga unte site visit arrange cheddama?";
      let toolAlert = null;

      if (textToSend.toLowerCase().includes('price') || textToSend.toLowerCase().includes('budget')) {
        reply = "Avunu sir, ardham ayyindi. Price important factor. Mee budget 1.5 Cr range lo comfortable options chuddam. Final limit 1.5 Cr aa?";
      } else if (textToSend.toLowerCase().includes('ok') || textToSend.toLowerCase().includes('sunday') || textToSend.toLowerCase().includes('visit')) {
        reply = "Perfect sir! Sunday 11:00 AM site visit confirmed. WhatsApp lo brochure link pampinchanu. Thank you!";
        toolAlert = "Action Triggered: Booked Site Visit (Sunday 11 AM) + Sent WhatsApp Brochure";
        setCallCompleted(true);
      }

      setTranscript([...updatedTranscript, { speaker: 'Meera', text: reply }]);
      speakText(reply);
      if (toolAlert) setCallToolAlert(toolAlert);
    }
  };

  const handleEndCall = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setCallActive(false);
    setIsSpeaking(false);
    setIsListening(false);
    setCallCompleted(true);
  };

  const handleAddProperty = (e) => {
    e.preventDefault();
    if (!propTitle) return;

    const newProp = {
      title: propTitle,
      location: propLocation,
      configurationType: propConfig,
      priceStarting: propPrice,
      amenities: ['Clubhouse', 'Power Backup', 'Security'],
      description: 'Newly added property configuration'
    };

    setKnowledgeBase({
      ...knowledgeBase,
      properties: [...(knowledgeBase?.properties || []), newProp]
    });

    setShowPropertyModal(false);
    setPropTitle('');
  };

  if (!employee) {
    return <div className="p-8 text-slate-400 text-center">Loading Studio...</div>;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header Banner */}
      <div className="p-7 rounded-[28px] bg-[#F0F4F9] border border-[#E3E3E3] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#E8F0FE] flex items-center justify-center font-bold text-2xl text-[#1A73E8] shrink-0">
            {employee.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-[#1F1F1F]">{employee.name}</h1>
              <Badge status={employee.status} />
            </div>
            <p className="text-xs text-[#1A73E8] font-semibold mt-0.5">Real Estate Sales Voice Representative</p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#5F6368] mt-1 font-mono">
              <span>Phone: <strong className="text-[#1F1F1F]">{employee.phoneNumber}</strong></span>
              <span>Rate: <strong className="text-[#1A73E8]">₹3.50/min</strong></span>
              <span>Version: <strong className="text-[#1F1F1F]">v{employee.currentDraftVersion}</strong></span>
            </div>
          </div>
        </div>

        {/* Status indicator */}
        <div className="px-4 py-3 rounded-[20px] bg-white border border-[#E3E3E3] flex items-center gap-3 shadow-none">
          <ShieldCheck className="w-5 h-5 text-[#1A73E8] shrink-0" />
          <div className="text-xs">
            <div className="font-bold text-[#1F1F1F]">System Ready</div>
            <div className="text-[#5F6368] text-[11px] font-mono">Direct Dispatch Enabled</div>
          </div>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex items-center gap-2 border-b border-[#E3E3E3] pb-3 overflow-x-auto whitespace-nowrap scrollbar-none">
        {[
          { id: 'STUDIO', label: 'Call Simulation', icon: PhoneCall },
          { id: 'BRAIN', label: 'Knowledge Base', icon: Building2 },
          { id: 'VOICE', label: 'Language Settings', icon: Globe },
          { id: 'VERSIONS', label: 'Version History', icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition shrink-0 ${
                activeTab === tab.id
                  ? 'bg-[#1A73E8] text-white shadow-none'
                  : 'text-[#1F1F1F] hover:bg-[#F8F9FA] border border-transparent hover:border-[#E3E3E3]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: TEST CALL STUDIO */}
      {activeTab === 'STUDIO' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column: Call Console */}
          <div className="lg:col-span-2 gemini-card p-6 flex flex-col justify-between min-h-[500px]">
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-[#E3E3E3] pb-3">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-[#1A73E8]" />
                  <h3 className="text-sm font-bold text-[#1F1F1F]">Voice Simulation Console</h3>
                </div>
                {callActive ? (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F0FE] text-[#1A73E8] text-xs font-semibold border border-[#1A73E8]/20">
                    <span className="w-2 h-2 rounded-full bg-[#1A73E8] animate-ping"></span>
                    Call Active
                  </span>
                ) : (
                  <span className="text-xs text-[#5F6368] font-mono">Status: Standby</span>
                )}
              </div>

              {/* Waveform Visualizer */}
              <div className="mb-4">
                <WaveformVisualizer isSpeaking={isSpeaking} />
              </div>

              {/* Tool Execution Alert Notification */}
              {callToolAlert && (
                <div className="mb-4 p-3.5 rounded-[16px] bg-[#E8F0FE] border border-[#1A73E8]/30 text-[#1F1F1F] text-xs font-semibold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#1A73E8] shrink-0" />
                  <span>{callToolAlert}</span>
                </div>
              )}

              {/* Transcript Stream Box */}
              <div className="p-4 rounded-[20px] bg-[#F0F4F9] border border-[#E3E3E3] h-64 overflow-y-auto space-y-3 font-sans">
                {transcript.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-[#5F6368] text-xs space-y-2">
                    <PhoneCall className="w-6 h-6 text-[#747775]" />
                    <span>Click "Start Test Call" to begin voice simulation.</span>
                  </div>
                ) : (
                  transcript.map((t, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${t.speaker === 'Meera' ? 'items-start' : 'items-end'}`}
                    >
                      <span className="text-[10px] text-[#5F6368] mb-0.5 font-mono">{t.speaker}</span>
                      <div
                        className={`max-w-[85%] px-4 py-2.5 rounded-[18px] text-xs leading-relaxed ${
                          t.speaker === 'Meera'
                            ? 'bg-[#1A73E8] text-white'
                            : 'bg-white text-[#1F1F1F] border border-[#E3E3E3] shadow-none'
                        }`}
                      >
                        {t.text}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Controls & Quick Prompts */}
            <div className="mt-4 pt-4 border-t border-[#E3E3E3] space-y-3">
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="text-[#5F6368] text-[11px] self-center font-medium">Quick Test Inputs:</span>
                <button
                  onClick={() => handleSendSpeech("Price konchem ekkuva anipisthundi")}
                  disabled={!callActive}
                  className="px-3 py-1 rounded-full bg-white hover:bg-[#F8F9FA] border border-[#747775] text-[#1F1F1F] text-xs transition disabled:opacity-50"
                >
                  "Price is a bit high"
                </button>
                <button
                  onClick={() => handleSendSpeech("Sunday comfortable ga untundi site visit ki")}
                  disabled={!callActive}
                  className="px-3 py-1 rounded-full bg-white hover:bg-[#F8F9FA] border border-[#747775] text-[#1F1F1F] text-xs transition disabled:opacity-50"
                >
                  "Sunday site visit okay"
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {!callActive ? (
                  <button
                    onClick={handleStartTestCall}
                    className="btn-gemini-primary w-full py-3 text-xs font-semibold flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Start Test Call Studio</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={toggleListening}
                      title={isListening ? "Listening... click to stop" : "Click to speak via Microphone"}
                      className={`p-3 rounded-full text-white transition flex items-center justify-center ${
                        isListening ? 'bg-[#D93025] animate-pulse' : 'bg-[#1F1F1F] hover:bg-[#303030]'
                      }`}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>

                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendSpeech()}
                      placeholder={isListening ? "Listening to your voice..." : "Type or speak in Telugu/English..."}
                      className="flex-1 px-4 py-2.5 rounded-[12px] border border-[#747775] text-xs text-[#1F1F1F] focus:outline-none focus:border-[#1A73E8]"
                    />

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSendSpeech()}
                        className="btn-gemini-primary p-3 rounded-full flex-1 sm:flex-initial flex items-center justify-center"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleEndCall}
                        className="px-5 py-2.5 rounded-full bg-[#1F1F1F] hover:bg-[#303030] text-white text-xs font-semibold transition flex items-center justify-center gap-1.5 flex-1 sm:flex-initial"
                      >
                        <Square className="w-4 h-4 fill-current" />
                        <span>End</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Lead Memory */}
          <div className="space-y-6">
            <div className="gemini-card p-6">
              <h4 className="text-sm font-bold text-[#1F1F1F] mb-3">Active Lead Context</h4>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-[12px] bg-[#F0F4F9] border border-[#E3E3E3] flex justify-between items-center">
                  <span className="text-[#5F6368]">Lead Name</span>
                  <span className="font-bold text-[#1F1F1F]">Rahul Sharma</span>
                </div>
                <div className="p-3 rounded-[12px] bg-[#F0F4F9] border border-[#E3E3E3] flex justify-between items-center">
                  <span className="text-[#5F6368]">Phone</span>
                  <span className="font-mono text-[#1F1F1F] font-semibold">+91 98765 43210</span>
                </div>
                <div className="p-3 rounded-[12px] bg-[#F0F4F9] border border-[#E3E3E3] flex justify-between items-center">
                  <span className="text-[#5F6368]">Target Project</span>
                  <span className="text-[#1A73E8] font-bold">Gachibowli Heights</span>
                </div>
                <div className="p-3 rounded-[12px] bg-[#F0F4F9] border border-[#E3E3E3] flex justify-between items-center">
                  <span className="text-[#5F6368]">Budget Limit</span>
                  <span className="text-[#1F1F1F] font-bold font-mono">₹1.5 Crore</span>
                </div>
              </div>
            </div>

            <div className="gemini-card p-6">
              <h4 className="text-sm font-bold text-[#1F1F1F] mb-3">Call Diagnostic Metrics</h4>
              <div className="space-y-2.5 text-xs text-[#5F6368]">
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <strong className="text-[#1F1F1F]">2m 18s</strong>
                </div>
                <div className="flex justify-between">
                  <span>Billed Minutes:</span>
                  <strong className="text-[#1F1F1F] font-mono">3 Mins</strong>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#E3E3E3] font-bold text-sm">
                  <span className="text-[#1F1F1F]">Cost:</span>
                  <span className="text-[#1A73E8] font-mono">₹10.50</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BRAIN */}
      {activeTab === 'BRAIN' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-[#1F1F1F]">Knowledge Base & Inventory</h3>
              <p className="text-xs text-[#5F6368]">Manage real estate project listings, specs, and price parameters.</p>
            </div>
            <button
              onClick={() => setShowPropertyModal(true)}
              className="btn-gemini-primary px-5 py-2.5 text-xs font-semibold flex items-center gap-1.5 self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Property Configuration</span>
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {knowledgeBase?.properties?.map((prop, idx) => (
              <div key={idx} className="gemini-card p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-[#1F1F1F]">{prop.title}</h4>
                  <span className="px-3 py-1 rounded-full bg-[#E8F0FE] text-[#1A73E8] text-xs font-mono font-bold">
                    {prop.priceStarting}
                  </span>
                </div>
                <div className="text-xs text-[#5F6368] font-medium">{prop.location} • {prop.configurationType}</div>
                <p className="text-xs text-[#444746] leading-relaxed font-normal">{prop.description}</p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {prop.amenities?.map((am, i) => (
                    <span key={i} className="text-[10px] px-2.5 py-1 rounded-full bg-[#F0F4F9] text-[#1F1F1F] border border-[#E3E3E3] font-medium">
                      {am}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: VOICE */}
      {activeTab === 'VOICE' && (
        <div className="gemini-card p-6 max-w-2xl space-y-4">
          <h3 className="text-base font-bold text-[#1F1F1F]">Language & Voice Dialect Configuration</h3>
          <div>
            <label className="block text-xs font-semibold text-[#1F1F1F] mb-1">Language Dialect</label>
            <input
              type="text"
              readOnly
              value="Telugu + English (Hyderabad)"
              className="w-full px-4 py-2.5 rounded-[12px] border border-[#E3E3E3] text-xs text-[#1F1F1F] bg-[#F0F4F9] font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1F1F1F] mb-1">Greeting Template</label>
            <textarea
              rows={3}
              defaultValue={employee?.configuration?.greeting}
              className="w-full p-3.5 rounded-[12px] border border-[#747775] text-xs text-[#1F1F1F] focus:outline-none focus:border-[#1A73E8]"
            />
          </div>
        </div>
      )}

      {/* TAB 4: VERSIONS */}
      {activeTab === 'VERSIONS' && (
        <div className="gemini-card p-6 max-w-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#1F1F1F]">Version Control & Release History</h3>
            <span className="text-xs font-semibold text-[#1A73E8]">Active Release: v1</span>
          </div>

          <div className="p-4 rounded-[20px] bg-[#F0F4F9] border border-[#E3E3E3] flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-[#1F1F1F]">Version 1 (Production Live)</div>
              <div className="text-[#5F6368] text-[11px] font-normal">Hyderabad Telugu+English real estate consultative conversational model</div>
            </div>
            <Badge status="LIVE" />
          </div>
        </div>
      )}

      {/* Add Property Modal */}
      <Modal
        isOpen={showPropertyModal}
        onClose={() => setShowPropertyModal(false)}
        title="Add Property Configuration"
      >
        <form onSubmit={handleAddProperty} className="space-y-4 font-sans">
          <div>
            <label className="block text-xs font-semibold text-[#1F1F1F] mb-1">Project Title</label>
            <input
              type="text"
              value={propTitle}
              onChange={(e) => setPropTitle(e.target.value)}
              required
              placeholder="e.g. Hitec City Residency"
              className="w-full px-4 py-2.5 rounded-[12px] border border-[#747775] text-xs text-[#1F1F1F] focus:outline-none focus:border-[#1A73E8]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1F1F1F] mb-1">Starting Price</label>
              <input
                type="text"
                value={propPrice}
                onChange={(e) => setPropPrice(e.target.value)}
                className="w-full px-4 py-2.5 rounded-[12px] border border-[#747775] text-xs text-[#1F1F1F] focus:outline-none focus:border-[#1A73E8]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1F1F1F] mb-1">Configuration</label>
              <input
                type="text"
                value={propConfig}
                onChange={(e) => setPropConfig(e.target.value)}
                className="w-full px-4 py-2.5 rounded-[12px] border border-[#747775] text-xs text-[#1F1F1F] focus:outline-none focus:border-[#1A73E8]"
              />
            </div>
          </div>
          <button
            type="submit"
            className="btn-gemini-primary w-full py-3 text-xs font-semibold"
          >
            Add Property to Knowledge Base
          </button>
        </form>
      </Modal>
    </div>
  );
}

