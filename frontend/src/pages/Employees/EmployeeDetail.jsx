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
  Globe
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

  const handleStartTestCall = async () => {
    setCallActive(true);
    setCallCompleted(false);
    setCallToolAlert(null);
    setIsSpeaking(true);

    try {
      const res = await api.post(`/employees/${employee._id || id}/test-call`);
      if (res.data.success) {
        setCallId(res.data.callId);
        setTranscript([
          { speaker: 'Meera', text: res.data.initialGreeting }
        ]);
      }
    } catch (err) {
      setCallId('mock_call_101');
      setTranscript([
        { speaker: 'Meera', text: employee?.configuration?.greeting || 'Hello sir, nenu Meera maatladutunnanu ABC Properties nunchi. Meeru Gachibowli lo 3BHK kosam enquiry chesaru kada?' }
      ]);
    } finally {
      setTimeout(() => setIsSpeaking(false), 2500);
    }
  };

  const handleSendSpeech = async (overrideText = null) => {
    const textToSend = overrideText || userInput;
    if (!textToSend.trim()) return;

    setUserInput('');
    setIsSpeaking(true);

    const updatedTranscript = [...transcript, { speaker: 'Customer', text: textToSend }];
    setTranscript(updatedTranscript);

    try {
      const res = await api.post('/employees/test-call/interact', {
        callId,
        message: textToSend
      });

      if (res.data.success) {
        setTranscript(res.data.transcript);
        if (res.data.actionTriggered === 'BOOK_SITE_VISIT_AND_WHATSAPP') {
          setCallToolAlert('✓ Action Triggered: Google Calendar Site Visit Booked for Sunday 11 AM + WhatsApp Brochure Sent!');
        }
        if (res.data.isCompleted) {
          setCallCompleted(true);
        }
      }
    } catch (err) {
      setTimeout(() => {
        let reply = "Sure sir! Mee requirement prakaram Gachibowli project options review chesa. Sunday comfortable ga unte site visit arrange cheddama?";
        let toolAlert = null;

        if (textToSend.toLowerCase().includes('price') || textToSend.toLowerCase().includes('budget')) {
          reply = "Avunu sir, ardham ayyindi. Price important factor. Mee budget 1.5 Cr range lo comfortable options chuddam. Final limit 1.5 Cr aa?";
        } else if (textToSend.toLowerCase().includes('ok') || textToSend.toLowerCase().includes('sunday') || textToSend.toLowerCase().includes('visit')) {
          reply = "Perfect sir! Sunday 11:00 AM site visit confirmed. WhatsApp lo brochure link pampinchanu. Thank you!";
          toolAlert = "✓ Action Triggered: Booked Site Visit (Sunday 11 AM) + Sent WhatsApp Brochure";
          setCallCompleted(true);
        }

        setTranscript([...updatedTranscript, { speaker: 'Meera', text: reply }]);
        if (toolAlert) setCallToolAlert(toolAlert);
      }, 1000);
    } finally {
      setTimeout(() => setIsSpeaking(false), 2000);
    }
  };

  const handleEndCall = () => {
    setCallActive(false);
    setIsSpeaking(false);
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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-xl text-blue-600 shrink-0">
            {employee.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-slate-900">{employee.name}</h1>
              <Badge status={employee.status} />
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Real Estate Sales Voice Representative</p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-1 font-mono">
              <span>Phone: <strong className="text-slate-900">{employee.phoneNumber}</strong></span>
              <span>Rate: <strong className="text-blue-600">₹3.50/min</strong></span>
              <span>Version: <strong className="text-slate-900">v{employee.currentDraftVersion}</strong></span>
            </div>
          </div>
        </div>

        {/* Status indicator */}
        <div className="px-4 py-2.5 rounded-lg bg-blue-50 border border-blue-200 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
          <div className="text-xs">
            <div className="font-semibold text-blue-900">System Ready</div>
            <div className="text-blue-700 text-[11px]">Valid Line • Direct Dispatch Enabled</div>
          </div>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto whitespace-nowrap scrollbar-none">
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
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition shrink-0 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[500px]">
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900">Voice Simulation Console</h3>
                </div>
                {callActive ? (
                  <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-medium border border-blue-200">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
                    Call Active
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">Ready</span>
                )}
              </div>

              {/* Waveform Visualizer */}
              <div className="mb-4">
                <WaveformVisualizer isSpeaking={isSpeaking} />
              </div>

              {/* Tool Execution Alert Notification */}
              {callToolAlert && (
                <div className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{callToolAlert}</span>
                </div>
              )}

              {/* Transcript Stream Box */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 h-64 overflow-y-auto space-y-3 font-sans">
                {transcript.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs space-y-2">
                    <PhoneCall className="w-6 h-6 text-slate-300" />
                    <span>Click "Start Test Call" to begin voice simulation.</span>
                  </div>
                ) : (
                  transcript.map((t, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${t.speaker === 'Meera' ? 'items-start' : 'items-end'}`}
                    >
                      <span className="text-[10px] text-slate-400 mb-0.5 font-mono">{t.speaker}</span>
                      <div
                        className={`max-w-[85%] px-3.5 py-2 rounded-lg text-xs leading-relaxed ${
                          t.speaker === 'Meera'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-slate-800 border border-slate-200 shadow-xs'
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
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="text-slate-400 text-[11px] self-center">Prompts:</span>
                <button
                  onClick={() => handleSendSpeech("Price konchem ekkuva anipisthundi")}
                  disabled={!callActive}
                  className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 disabled:opacity-50"
                >
                  "Price is a bit high"
                </button>
                <button
                  onClick={() => handleSendSpeech("Sunday comfortable ga untundi site visit ki")}
                  disabled={!callActive}
                  className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 disabled:opacity-50"
                >
                  "Sunday site visit okay"
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {!callActive ? (
                  <button
                    onClick={handleStartTestCall}
                    className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs flex items-center justify-center gap-2 transition"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Start Test Call</span>
                  </button>
                ) : (
                  <>
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendSpeech()}
                      placeholder="Type response in Telugu/English..."
                      className="flex-1 px-3.5 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSendSpeech()}
                        className="p-2.5 rounded-lg bg-blue-600 text-white transition hover:bg-blue-700 flex-1 sm:flex-initial flex items-center justify-center"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleEndCall}
                        className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition flex items-center justify-center gap-1.5 flex-1 sm:flex-initial"
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
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="text-sm font-bold text-slate-900 mb-3">Active Lead Memory</h4>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between">
                  <span className="text-slate-500">Lead Name</span>
                  <span className="font-semibold text-slate-900">Rahul Sharma</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between">
                  <span className="text-slate-500">Phone</span>
                  <span className="font-mono text-slate-700">+91 98765 43210</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between">
                  <span className="text-slate-500">Target Project</span>
                  <span className="text-blue-600 font-semibold">Gachibowli Heights</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between">
                  <span className="text-slate-500">Budget Limit</span>
                  <span className="text-slate-900 font-bold">₹1.5 Crore</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="text-sm font-bold text-slate-900 mb-3">Call Metrics</h4>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <strong className="text-slate-900">2m 18s</strong>
                </div>
                <div className="flex justify-between">
                  <span>Billed Minutes:</span>
                  <strong className="text-slate-900 font-mono">3 Mins</strong>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-100 font-bold text-sm">
                  <span>Cost:</span>
                  <span className="text-blue-600 font-mono">₹10.50</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BRAIN */}
      {activeTab === 'BRAIN' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Knowledge Base</h3>
              <p className="text-xs text-slate-500">Manage real estate project listings and parameters.</p>
            </div>
            <button
              onClick={() => setShowPropertyModal(true)}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Property</span>
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {knowledgeBase?.properties?.map((prop, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-slate-900">{prop.title}</h4>
                  <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 text-xs font-mono font-semibold border border-blue-200">
                    {prop.priceStarting}
                  </span>
                </div>
                <div className="text-xs text-slate-500">{prop.location} • {prop.configurationType}</div>
                <p className="text-xs text-slate-600 leading-relaxed">{prop.description}</p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {prop.amenities?.map((am, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
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
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-2xl space-y-4">
          <h3 className="text-base font-bold text-slate-900">Language & Voice Configuration</h3>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Language Dialect</label>
            <input
              type="text"
              readOnly
              value="Telugu + English (Hyderabad)"
              className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 bg-slate-50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Greeting Template</label>
            <textarea
              rows={3}
              defaultValue={employee?.configuration?.greeting}
              className="w-full p-3 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>
      )}

      {/* TAB 4: VERSIONS */}
      {activeTab === 'VERSIONS' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Version History</h3>
            <span className="text-xs font-medium text-slate-600">Active Version: v1</span>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-slate-900">Version 1 (Live)</div>
              <div className="text-slate-500 text-[11px]">Hyderabad Telugu+English real estate consultative model</div>
            </div>
            <Badge status="LIVE" />
          </div>
        </div>
      )}

      {/* Add Property Modal */}
      <Modal
        isOpen={showPropertyModal}
        onClose={() => setShowPropertyModal(false)}
        title="Add Property"
      >
        <form onSubmit={handleAddProperty} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Project Name</label>
            <input
              type="text"
              value={propTitle}
              onChange={(e) => setPropTitle(e.target.value)}
              required
              placeholder="e.g. Hitec City Residency"
              className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Starting Price</label>
              <input
                type="text"
                value={propPrice}
                onChange={(e) => setPropPrice(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Configuration</label>
              <input
                type="text"
                value={propConfig}
                onChange={(e) => setPropConfig(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-medium text-xs hover:bg-blue-700 transition"
          >
            Add Property
          </button>
        </form>
      </Modal>
    </div>
  );
}

