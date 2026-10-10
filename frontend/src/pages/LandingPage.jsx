import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronDown, 
  ChevronUp, 
  X, 
  PhoneCall, 
  Calendar, 
  MessageSquare, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Play, 
  Users, 
  TrendingUp, 
  Volume2 
} from 'lucide-react';
import Footer from '../components/layout/Footer';

export default function LandingPage() {
  const navigate = useNavigate();
  const [showBanner, setShowBanner] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [openFaq, setOpenFaq] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoPlaying, setDemoPlaying] = useState(false);

  const faqs = [
    {
      q: 'How does representative Meera handle regional Telugu and English code-switching?',
      a: 'Meera is trained on real conversational patterns from Indian enterprise sales calls. She dynamically switches between Telugu and English (such as Hyderabad regional dialogue), understanding local nuances, budget expectations, and handling price hesitation with natural empathy.'
    },
    {
      q: 'Can Shiftexa schedule site visits directly to Google Calendar?',
      a: 'Yes! During a live call, when a lead agrees to a site visit, Shiftexa automatically queries your team\'s Google Calendar availability, confirms the slot with the prospect, books the event, and dispatches a Google Calendar invite in real time.'
    },
    {
      q: 'How does WhatsApp brochure dispatch work during a call?',
      a: 'Shiftexa connects directly to the Meta WhatsApp Business API. As soon as a prospect requests project details, floor plans, or location pins, the voice representative triggers an instant WhatsApp message delivered to the prospect\'s phone before the call ends.'
    },
    {
      q: 'What CRM platforms and tools can Shiftexa sync with?',
      a: 'Shiftexa features out-of-the-box integrations with Zoho CRM, Salesforce, HubSpot, Google Sheets, and custom HTTP REST Webhooks for instant lead scoring, call transcript syncing, and call logging.'
    },
    {
      q: 'How is billing calculated for AI voice calls?',
      a: 'Billing is strictly calculated on a per-second basis based on actual voice conversation minutes. Rates start at ₹3.50/min on the Starter plan and drop to ₹2.50/min for Enterprise high-volume dispatch. You only pay for answered calls.'
    }
  ];

  const handleDemoAudioToggle = () => {
    if (!('speechSynthesis' in window)) return;
    if (demoPlaying) {
      window.speechSynthesis.cancel();
      setDemoPlaying(false);
    } else {
      setDemoPlaying(true);
      const text = "Hello sir, nenu Meera maatladutunnanu ABC Properties nunchi. Meeru Gachibowli lo 3BHK kosam enquiry chesaru kada? Sunday comfortable ga unte site visit arrange cheddama?";
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.05;
      utterance.onend = () => setDemoPlaying(false);
      utterance.onerror = () => setDemoPlaying(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-[#1F1F1F] flex flex-col font-sans">
      {/* Top Banner Notice */}
      {showBanner && (
        <div className="bg-[#E8F0FE]/95 backdrop-blur-xs text-xs py-2.5 px-4 flex items-center justify-center gap-2 border-b border-[#D2E3FC] text-[#1A73E8] relative">
          <span>
            <strong>New Release:</strong> Autonomous Voice Representative <strong>Meera</strong> is live for Real Estate Enterprises.{' '}
            <a href="#solutions" className="font-semibold underline hover:text-[#1557B0]">
              Deploy today with 100 free call credits →
            </a>
          </span>
          <button 
            onClick={() => setShowBanner(false)}
            className="absolute right-4 text-slate-500 hover:text-slate-900"
            aria-label="Close notice banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header Navigation */}
      <nav className="h-16 border-b border-[#E3E3E3] px-4 md:px-12 flex items-center justify-between sticky top-0 bg-[#FFFFFF]/90 backdrop-blur-md z-40">
        <div className="flex items-center cursor-pointer gap-2" onClick={() => navigate('/')}>
          <span className="font-brand text-3xl font-bold text-[#1F1F1F] tracking-tight">
            Shiftexa
          </span>
        </div>

        {/* Center Nav Links - Desktop */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#444746]">
          <a href="#solutions" className="hover:text-[#1A73E8] transition">Workforce Solutions</a>
          <a href="#features" className="hover:text-[#1A73E8] transition">Platform & Voice AI</a>
          <a href="#pricing" className="hover:text-[#1A73E8] transition">Enterprise Pricing</a>
          <a href="#faqs" className="hover:text-[#1A73E8] transition">FAQs</a>
        </div>

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button 
            onClick={() => navigate('/login')} 
            className="btn-gemini-outline px-4 py-2 text-xs font-semibold"
          >
            Sign In
          </button>
          <button 
            onClick={() => navigate('/signup')} 
            className="btn-gemini-primary px-5 py-2.5 text-xs font-semibold flex items-center gap-1.5"
          >
            <span>Deploy Voice Representative</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => navigate('/login')}
            className="text-xs font-semibold text-[#1A73E8] px-3 py-1.5 rounded-full border border-[#E3E3E3]"
          >
            Sign In
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#444746] hover:bg-[#F0F4F9] rounded-lg"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <ChevronDown className="w-6 h-6 rotate-270" />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FFFFFF] border-b border-[#E3E3E3] p-4 space-y-3 z-30 shadow-lg">
          <a 
            href="#solutions" 
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-[#444746] hover:bg-[#F0F4F9] rounded-lg"
          >
            Workforce Solutions
          </a>
          <a 
            href="#features" 
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-[#444746] hover:bg-[#F0F4F9] rounded-lg"
          >
            Platform & Voice AI
          </a>
          <a 
            href="#pricing" 
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-[#444746] hover:bg-[#F0F4F9] rounded-lg"
          >
            Enterprise Pricing
          </a>
          <a 
            href="#faqs" 
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-[#444746] hover:bg-[#F0F4F9] rounded-lg"
          >
            Frequently Asked Questions
          </a>
          <div className="pt-2 border-t border-[#E3E3E3] space-y-2">
            <button
              onClick={() => { setMobileMenuOpen(false); navigate('/signup'); }}
              className="w-full text-center rounded-full bg-[#1A73E8] hover:bg-[#1557B0] text-white font-semibold text-xs py-3 flex items-center justify-center gap-1.5"
            >
              <span>Deploy Voice Representative</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16 pt-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#1F1F1F] mb-6 leading-tight">
            Hire AI Voice Representatives That <span className="text-[#1A73E8]">Convert Regional Leads</span>
          </h1>

          <p className="text-[#5F6368] text-base md:text-xl font-normal max-w-3xl mx-auto mb-10 leading-relaxed">
            Qualify prospects in natural regional dialects (Telugu, Hinglish, Hindi, English), overcome price hesitation, schedule site visits directly to Google Calendar, and send WhatsApp brochures—24/7.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={() => navigate('/signup')}
              className="btn-gemini-primary w-full sm:w-auto px-8 py-4 text-sm font-semibold flex items-center justify-center gap-2"
            >
              <span>Deploy Your First Representative</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/login')}
              className="btn-gemini-outline w-full sm:w-auto px-8 py-4 text-sm font-semibold flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-[#1A73E8]" />
              <span>Explore Live Dashboard</span>
            </button>
          </div>

          {/* Value Metrics Pill Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-[#E3E3E3]">
            <div className="p-4 rounded-2xl bg-[#F0F4F9] border border-[#E3E3E3]">
              <div className="text-2xl font-bold text-[#1A73E8] font-mono">&lt; 800ms</div>
              <div className="text-xs text-[#5F6368] mt-1 font-medium">Voice Response Latency</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#F0F4F9] border border-[#E3E3E3]">
              <div className="text-2xl font-bold text-[#1F1F1F] font-mono">100%</div>
              <div className="text-xs text-[#5F6368] mt-1 font-medium">Telugu & English Dialect</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#F0F4F9] border border-[#E3E3E3]">
              <div className="text-2xl font-bold text-[#1A73E8] font-mono">10x Lower</div>
              <div className="text-xs text-[#5F6368] mt-1 font-medium">CAC vs Manual Callers</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#F0F4F9] border border-[#E3E3E3]">
              <div className="text-2xl font-bold text-[#1F1F1F] font-mono">Instant</div>
              <div className="text-xs text-[#5F6368] mt-1 font-medium">Calendar & WhatsApp Sync</div>
            </div>
          </div>
        </div>

        {/* Live Audio & Representative Interactive Spotlight */}
        <div className="gemini-card p-6 md:p-10 mb-24 max-w-5xl mx-auto bg-gradient-to-b from-white to-[#F0F4F9]/60">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 border-b border-[#E3E3E3] pb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1F1F1F]">
                Representative <span className="text-[#1A73E8]">Meera</span> — Real Estate Sales Specialist
              </h2>
              <p className="text-xs md:text-sm text-[#5F6368] mt-1">
                Trained specifically for Hyderabad & South Indian property sales, price objection handling, and slot booking.
              </p>
            </div>

            <button
              onClick={handleDemoAudioToggle}
              className={`px-6 py-3 rounded-full text-xs font-semibold flex items-center gap-2 transition shrink-0 ${
                demoPlaying
                  ? 'bg-rose-600 text-white shadow-md animate-pulse'
                  : 'bg-[#1A73E8] hover:bg-[#1557B0] text-white shadow-none'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{demoPlaying ? 'Stop Voice Audio' : 'Listen to Live Voice Demo'}</span>
            </button>
          </div>

          {/* Call Dialogue Preview */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-white border border-[#E3E3E3] space-y-3 text-xs leading-relaxed">
              <div className="flex items-center justify-between border-b border-[#E3E3E3] pb-2 font-mono text-[11px] text-[#5F6368]">
                <span>Sample Real Estate Lead Call Transcript</span>
                <span className="text-[#1A73E8] font-bold">Hyderabad Dialect</span>
              </div>

              <div className="space-y-3 font-sans">
                <div className="flex flex-col items-start">
                  <span className="text-[10px] text-[#5F6368] font-mono">Meera (AI Voice Rep) • 00:02</span>
                  <div className="bg-[#E8F0FE] text-[#1F1F1F] p-3 rounded-2xl rounded-tl-none mt-1">
                    Hello Rahul garu, nenu Meera maatladutunnanu ABC Properties nunchi. Meeru Gachibowli lo 3BHK kosam enquiry chesaru kada?
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-[#5F6368] font-mono">Prospect (Customer) • 00:08</span>
                  <div className="bg-white border border-[#E3E3E3] text-[#1F1F1F] p-3 rounded-2xl rounded-tr-none mt-1">
                    Avunu. Kaani price konchem ekkuva anipisthundi.
                  </div>
                </div>

                <div className="flex flex-col items-start">
                  <span className="text-[10px] text-[#5F6368] font-mono">Meera (AI Voice Rep) • 00:18</span>
                  <div className="bg-[#E8F0FE] text-[#1F1F1F] p-3 rounded-2xl rounded-tl-none mt-1">
                    Avunu Rahul garu, ardham ayyindi. Price important factor. Sunday comfortable ga unte site visit arrange cheddama? Google Calendar link pampisthanu.
                  </div>
                </div>
              </div>
            </div>

            {/* Real-Time Action Execution Stack */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[#1F1F1F] uppercase tracking-wider text-xs">Automated Action Execution Stack</h3>

              <div className="p-4 rounded-2xl bg-white border border-[#E3E3E3] flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#E8F0FE] text-[#1A73E8] flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1F1F1F]">Google Calendar Site Visit Slot Booking</h4>
                  <p className="text-[11px] text-[#5F6368] mt-0.5">
                    Checks executive slot availability live during the call and issues confirmed event invites directly to lead's email.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E3E3E3] flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1F1F1F]">Meta WhatsApp Business Dispatch</h4>
                  <p className="text-[11px] text-[#5F6368] mt-0.5">
                    Triggers instant WhatsApp brochure PDFs, project location links, and floor plan maps while on the phone.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E3E3E3] flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1F1F1F]">CRM Webhook Lead Sync</h4>
                  <p className="text-[11px] text-[#5F6368] mt-0.5">
                    Pushes lead qualification status (Budget, Location, Timeline) straight to Zoho CRM, Salesforce, or your backend.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Solutions Marketplace Section (#solutions) */}
        <section id="solutions" className="mb-24 scroll-mt-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1F1F1F]">
              Pre-Configured Representatives for Every Workflow
            </h2>
            <p className="text-xs md:text-sm text-[#5F6368] mt-2 font-normal">
              Select pre-trained digital employees ready to plug into your business pipelines within minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1: Meera */}
            <div className="gemini-card p-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#E8F0FE] text-[#1A73E8] flex items-center justify-center font-bold text-lg">
                    M
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E8F0FE] text-[#1A73E8] text-[10px] font-bold font-mono">
                    ₹3.50 / min
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#1F1F1F]">Meera</h3>
                <p className="text-xs text-[#1A73E8] font-semibold mb-3">Real Estate Sales Representative</p>
                <p className="text-xs text-[#5F6368] leading-relaxed mb-6">
                  Specialized in Indian real estate lead qualification, Telugu & English Hyderabad dialogue, price objection handling, project pricing, site visit scheduling, and automated WhatsApp follow-ups.
                </p>

                <div className="space-y-2 mb-6 text-xs text-[#444746]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1A73E8] shrink-0" />
                    <span>Natural Telugu + English Code-Switching</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1A73E8] shrink-0" />
                    <span>Google Calendar Site Visit Booking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1A73E8] shrink-0" />
                    <span>WhatsApp Brochure & Maps Dispatch</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/signup')}
                className="btn-gemini-primary w-full py-3 text-xs font-semibold"
              >
                Deploy Meera
              </button>
            </div>

            {/* Card 2: Riya */}
            <div className="gemini-card p-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#E8F0FE] text-[#1A73E8] flex items-center justify-center font-bold text-lg">
                    R
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E8F0FE] text-[#1A73E8] text-[10px] font-bold font-mono">
                    ₹3.00 / min
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#1F1F1F]">Riya</h3>
                <p className="text-xs text-[#1A73E8] font-semibold mb-3">Inbound Desk & Receptionist</p>
                <p className="text-xs text-[#5F6368] leading-relaxed mb-6">
                  Handles inbound business desk calls, screens inquiries, answers FAQs, routes calls to team members, and schedules appointments.
                </p>

                <div className="space-y-2 mb-6 text-xs text-[#444746]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1A73E8] shrink-0" />
                    <span>Inbound Desk & Screening</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1A73E8] shrink-0" />
                    <span>Smart Call Transfer & Routing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1A73E8] shrink-0" />
                    <span>English & Hindi Support</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/signup')}
                className="btn-gemini-primary w-full py-3 text-xs font-semibold"
              >
                Deploy Riya
              </button>
            </div>

            {/* Card 3: Anu */}
            <div className="gemini-card p-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#E8F0FE] text-[#1A73E8] flex items-center justify-center font-bold text-lg">
                    A
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E8F0FE] text-[#1A73E8] text-[10px] font-bold font-mono">
                    ₹3.50 / min
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#1F1F1F]">Anu</h3>
                <p className="text-xs text-[#1A73E8] font-semibold mb-3">Education & Admissions Counselor</p>
                <p className="text-xs text-[#5F6368] leading-relaxed mb-6">
                  Counsels prospective students, collects academic requirements, explains course fee structures, and schedules campus visits.
                </p>

                <div className="space-y-2 mb-6 text-xs text-[#444746]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1A73E8] shrink-0" />
                    <span>Course & Fee Structure Counseling</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1A73E8] shrink-0" />
                    <span>Campus Visit Slot Booking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1A73E8] shrink-0" />
                    <span>Multi-lingual Admission Guidance</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/signup')}
                className="btn-gemini-primary w-full py-3 text-xs font-semibold"
              >
                Deploy Anu
              </button>
            </div>
          </div>
        </section>

        {/* Enterprise Platform Features (#features) */}
        <section id="features" className="mb-24 scroll-mt-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1F1F1F]">
              Engineered for Enterprise Performance & Scale
            </h2>
            <p className="text-xs md:text-sm text-[#5F6368] mt-2">
              Everything you need to automate outbound and inbound phone operations at scale.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-[#E3E3E3] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#E8F0FE] text-[#1A73E8] flex items-center justify-center font-bold">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#1F1F1F] text-base">Regional Dialect Intelligence</h3>
              <p className="text-xs text-[#5F6368] leading-relaxed">
                Native Telugu, Hinglish, Hindi, and English voice models trained on regional Indian accents.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E3E3E3] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#E8F0FE] text-[#1A73E8] flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#1F1F1F] text-base">Real-Time Action Triggers</h3>
              <p className="text-xs text-[#5F6368] leading-relaxed">
                Direct execution of Google Calendar bookings, WhatsApp messages, and webhook triggers during calls.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E3E3E3] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#E8F0FE] text-[#1A73E8] flex items-center justify-center font-bold">
                <PhoneCall className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#1F1F1F] text-base">Diarized Transcripts & Audio</h3>
              <p className="text-xs text-[#5F6368] leading-relaxed">
                Full speaker-separated transcripts, call recording audio, and AI sentiment analysis for audit compliance.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E3E3E3] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#E8F0FE] text-[#1A73E8] flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#1F1F1F] text-base">Enterprise Security & RBAC</h3>
              <p className="text-xs text-[#5F6368] leading-relaxed">
                Role-based access control, Razorpay GST tax invoicing, and secure API key management.
              </p>
            </div>
          </div>
        </section>

        {/* Enterprise Pricing Tiers (#pricing) */}
        <section id="pricing" className="mb-24 scroll-mt-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1F1F1F]">
              Simple, Pay-Per-Second Usage Plans
            </h2>
            <p className="text-xs md:text-sm text-[#5F6368] mt-2">
              No hidden fees. Scale up or down as your lead campaign demands.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Plan 1: Starter */}
            <div className="gemini-card p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#1F1F1F] mb-1">Starter Trial</h3>
                <p className="text-xs text-[#5F6368] mb-6">Perfect for testing representative calls</p>
                <div className="text-3xl font-bold text-[#1F1F1F] mb-6 font-mono">
                  ₹0 <span className="text-xs font-normal text-[#5F6368]">/ 14-day trial</span>
                </div>
                <div className="space-y-3 text-xs text-[#444746] mb-8">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1A73E8]" />
                    <span>₹3.50 / min standard voice rate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1A73E8]" />
                    <span>1 Active Voice Representative</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1A73E8]" />
                    <span>Up to 100 Lead Qualification Calls</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1A73E8]" />
                    <span>Standard Webhook Sync</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/signup')}
                className="btn-gemini-outline w-full py-3 text-xs font-semibold"
              >
                Start Free Trial
              </button>
            </div>

            {/* Plan 2: Growth */}
            <div className="gemini-card p-8 flex flex-col justify-between border-2 border-[#1A73E8] relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#1A73E8] text-white text-[10px] font-bold uppercase tracking-wider">
                MOST POPULAR
              </span>
              <div>
                <h3 className="text-xl font-bold text-[#1F1F1F] mb-1">Growth Plan</h3>
                <p className="text-xs text-[#5F6368] mb-6">For growing sales & outreach teams</p>
                <div className="text-3xl font-bold text-[#1A73E8] mb-6 font-mono">
                  ₹2,999 <span className="text-xs font-normal text-[#5F6368]">/ month</span>
                </div>
                <div className="space-y-3 text-xs text-[#444746] mb-8">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1A73E8]" />
                    <span>Includes ₹3,000 Call Credits</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1A73E8]" />
                    <span>₹3.00 / min discounted rate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1A73E8]" />
                    <span>3 Active Voice Representatives</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1A73E8]" />
                    <span>Google Calendar & WhatsApp Meta API</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1A73E8]" />
                    <span>Diarized Transcripts & Audio Stream</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/signup')}
                className="btn-gemini-primary w-full py-3 text-xs font-semibold"
              >
                Claim Growth Plan
              </button>
            </div>

            {/* Plan 3: Enterprise */}
            <div className="gemini-card p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#1F1F1F] mb-1">Enterprise Scale</h3>
                <p className="text-xs text-[#5F6368] mb-6">For large call centers & developers</p>
                <div className="text-3xl font-bold text-[#1F1F1F] mb-6 font-mono">
                  ₹9,999 <span className="text-xs font-normal text-[#5F6368]">/ month</span>
                </div>
                <div className="space-y-3 text-xs text-[#444746] mb-8">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1A73E8]" />
                    <span>₹2.50 / min volume usage rate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1A73E8]" />
                    <span>Unlimited Active Voice Representatives</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1A73E8]" />
                    <span>Custom SIP Trunking & Dedicated Lines</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1A73E8]" />
                    <span>Custom Dialect Model Training</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1A73E8]" />
                    <span>24/7 Account Manager & SLA Guarantee</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/signup')}
                className="btn-gemini-outline w-full py-3 text-xs font-semibold"
              >
                Contact Enterprise Sales
              </button>
            </div>
          </div>
        </section>

        {/* Frequently Asked Questions Section (#faqs) */}
        <section id="faqs" className="max-w-3xl mx-auto my-16 scroll-mt-24 pt-4">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1F1F1F] text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-0 divide-y divide-[#E3E3E3] border-t border-b border-[#E3E3E3]">
            {faqs.map((faq, index) => (
              <div key={index} className="py-5">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between text-left text-base font-semibold text-[#1F1F1F] hover:text-[#1A73E8] transition gap-4 no-jelly"
                >
                  <span>{faq.q}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-[#5F6368] shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#5F6368] shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <p className="mt-3 text-sm text-[#5F6368] leading-relaxed pr-6 font-normal">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Global Classy Footer */}
      <Footer />
    </div>
  );
}



