import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, X, GraduationCap, Layers } from 'lucide-react';
import Footer from '../components/layout/Footer';

export default function LandingPage() {
  const navigate = useNavigate();
  const [showBanner, setShowBanner] = useState(true);
  const [activeTab, setActiveTab] = useState('Workflows');
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'Who is eligible for the free-of-charge business offer?',
      a: 'Any verified business owner, real estate developer, or enterprise team can claim 1 year of free usage credits for the SHIFTEXA Starter platform upon account initialization.'
    },
    {
      q: 'What is included in the free of charge SHIFTEXA Plus plan?',
      a: 'Includes full access to Representative Meera, automated Telugu & English voice dialogue, Google Calendar site visit slot booking, WhatsApp brochure dispatch, and CRM webhook integrations.'
    },
    {
      q: 'How is SHIFTEXA different from other voice automation tools?',
      a: 'SHIFTEXA representatives specialize in natural regional code-switching (like Hyderabad Telugu + English), handling price hesitation with empathy, and triggering direct business actions.'
    },
    {
      q: 'How do I deploy Meera for Telugu and English real estate calling?',
      a: 'Simply create an account, select Meera in the Solutions Store, configure your property pricing and location details, and click "Start Test Call" to begin outbound dispatch.'
    }
  ];

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#1F1F1F] flex flex-col font-sans">
      {/* Top Banner Notice */}
      {showBanner && (
        <div className="bg-[#F0F4F9] text-xs py-2.5 px-4 flex items-center justify-center gap-2 border-b border-[#E3E3E3] text-[#1F1F1F] relative">
          <GraduationCap className="w-4 h-4 text-[#1A73E8]" />
          <span>
            <strong>Businesses:</strong> Get a 1-year Starter plan <a href="#plans" className="text-[#1A73E8] font-semibold hover:underline">at no cost</a>. Promotion expires soon.
          </span>
          <button 
            onClick={() => setShowBanner(false)}
            className="absolute right-4 text-slate-500 hover:text-slate-900"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Gemini Style Header Navigation */}
      <nav className="h-16 border-b border-[#E3E3E3] px-4 md:px-12 flex items-center justify-between sticky top-0 bg-[#FFFFFF]/95 backdrop-blur-md z-40">
        <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
          <span className="font-brand text-3xl font-bold text-[#1F1F1F] tracking-tight">
            Shiftexa
          </span>
        </div>

        {/* Center Nav Links - Desktop */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#444746]">
          <a href="#businesses" className="text-[#1A73E8] font-semibold border-b-2 border-[#1A73E8] pb-4 pt-4">For Businesses</a>
          <a href="#plans" className="hover:text-[#1F1F1F] transition">Subscriptions</a>
          <a href="#faqs" className="hover:text-[#1F1F1F] transition">FAQs</a>
        </div>

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={() => navigate('/login')} 
            className="text-sm font-medium text-[#444746] hover:text-[#1F1F1F]"
          >
            Sign In
          </button>
          <button 
            onClick={() => navigate('/signup')} 
            className="rounded-full bg-[#1A73E8] hover:bg-[#1557B0] text-white font-semibold text-xs px-5 py-2.5 transition shadow-none"
          >
            Claim a business plan at no cost
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
            href="#businesses" 
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-[#1A73E8] hover:bg-[#F0F4F9] rounded-lg"
          >
            For Businesses
          </a>
          <a 
            href="#plans" 
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-[#444746] hover:bg-[#F0F4F9] rounded-lg"
          >
            Subscriptions & Plans
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
              className="w-full text-center rounded-full bg-[#1A73E8] hover:bg-[#1557B0] text-white font-semibold text-xs py-3"
            >
              Claim a business plan at no cost
            </button>
          </div>
        </div>
      )}

      {/* Segmented Sub-nav Pill Capsule */}
      <div className="flex justify-center pt-8">
        <div className="inline-flex items-center p-1 rounded-full border border-[#E3E3E3] bg-white shadow-xs text-xs font-medium text-[#5F6368]">
          {['Visualisations', 'Notebooks', 'Tools'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-1.5 rounded-full transition ${
                activeTab === tab
                  ? 'bg-[#F0F4F9] text-[#1F1F1F] font-semibold'
                  : 'hover:text-[#1F1F1F]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {/* Level Up Hero Heading */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#1F1F1F] mb-4">
            Ready to <span className="text-[#1A73E8]">level up</span> your business?
          </h1>
          <p className="text-[#5F6368] text-base md:text-lg font-normal max-w-2xl mx-auto mb-8">
            Claim your one-year SHIFTEXA Starter business plan today at no cost.
          </p>

          <button
            onClick={() => navigate('/signup')}
            className="btn-gemini-primary px-8 py-3.5 text-sm font-semibold shadow-none inline-block"
          >
            Claim a business plan at no cost
          </button>
        </div>

        {/* Country Badge */}
        <div className="flex justify-end mb-6 text-xs text-[#5F6368] font-medium items-center gap-1.5">
          <span className="text-base">🇮🇳</span>
          <span>India</span>
        </div>

        {/* 4 Cards Grid - Replica of Gemini Subscription Cards */}
        <div id="plans" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {/* Card 1: Free of charge */}
          <div className="gemini-card p-7 flex flex-col justify-between min-h-[440px]">
            <div>
              <div className="min-h-[20px] mb-2"></div>
              <h3 className="text-2xl font-bold text-[#1F1F1F] mb-3">Free of charge</h3>
              <p className="text-sm text-[#5F6368] leading-relaxed mb-8">
                Get <strong>everyday help</strong> from SHIFTEXA AI to tackle tasks at work, school or home.
              </p>

              <div className="mb-6">
                <div className="text-3xl font-bold text-[#1F1F1F] inline-flex items-baseline gap-1">
                  <span>₹0</span>
                  <span className="text-xs text-[#5F6368] font-normal">INR/month with a Google Account</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className="btn-gemini-outline w-full py-3 text-sm font-semibold"
            >
              Get started
            </button>
          </div>

          {/* Card 2: SHIFTEXA AI Plus */}
          <div className="gemini-card p-7 flex flex-col justify-between min-h-[440px]">
            <div>
              <div className="text-[#1A73E8] text-xs font-semibold min-h-[20px] mb-2">
                New features added
              </div>
              <h3 className="text-2xl font-bold text-[#1F1F1F] mb-3">
                SHIFTEXA Plus<sup className="text-xs text-[#5F6368] font-normal">1</sup>
              </h3>
              <p className="text-sm text-[#5F6368] leading-relaxed mb-8">
                Get <strong>more access</strong> to new and powerful features to boost your productivity and creativity.
              </p>

              <div className="mb-6">
                <div className="text-3xl font-bold text-[#1A73E8] inline-flex items-baseline gap-1">
                  <span>₹399</span>
                  <span className="text-xs text-[#5F6368] font-normal">INR/month</span>
                </div>
                <p className="text-[11px] text-[#5F6368] mt-2">
                  Get 2x higher usage access than Free-of-charge
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className="btn-gemini-primary w-full py-3 text-sm font-semibold"
            >
              Get started
            </button>
          </div>

          {/* Card 3: SHIFTEXA AI Pro */}
          <div className="gemini-card p-7 flex flex-col justify-between min-h-[440px]">
            <div>
              <div className="text-[#1A73E8] text-xs font-semibold min-h-[20px] mb-2">
                New features added
              </div>
              <h3 className="text-2xl font-bold text-[#1F1F1F] mb-3">
                SHIFTEXA Pro<sup className="text-xs text-[#5F6368] font-normal">1</sup>
              </h3>
              <p className="text-sm text-[#5F6368] leading-relaxed mb-8">
                Get <strong>higher access</strong> to new and powerful features to boost your productivity and creativity.
              </p>

              <div className="mb-6">
                <div className="text-3xl font-bold text-[#1A73E8] inline-flex items-baseline gap-1">
                  <span>₹1,950</span>
                  <span className="text-xs text-[#5F6368] font-normal">INR/month</span>
                </div>
                <p className="text-[11px] text-[#5F6368] mt-2">
                  Get 4x higher usage access than Free-of-charge
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className="btn-gemini-primary w-full py-3 text-sm font-semibold"
            >
              Get started
            </button>
          </div>

          {/* Card 4: SHIFTEXA AI Ultra */}
          <div className="gemini-card p-7 flex flex-col justify-between min-h-[440px]">
            <div>
              <div className="min-h-[20px] mb-2"></div>
              <h3 className="text-2xl font-bold text-[#1F1F1F] mb-3">
                SHIFTEXA Ultra<sup className="text-xs text-[#5F6368] font-normal">1</sup>
              </h3>
              <p className="text-sm text-[#5F6368] leading-relaxed mb-6">
                Unlock the <strong>highest level of access</strong> to the best of SHIFTEXA AI and exclusive features.
              </p>

              <div className="mb-6">
                <div className="text-xs text-[#5F6368] mb-0.5">Starting at:</div>
                <div className="text-3xl font-bold text-[#1A73E8] inline-flex items-baseline gap-1">
                  <span>₹6,500</span>
                  <span className="text-xs text-[#5F6368] font-normal">INR/month</span>
                </div>
                <div className="text-[10px] text-[#747775] mt-2 space-y-0.5">
                  <p>₹6,500 INR/month: 5x higher usage limits vs. AI Pro</p>
                  <p>₹19,500 INR/month: 20x higher usage limits vs. AI Pro</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className="btn-gemini-primary w-full py-3 text-sm font-semibold"
            >
              Get started
            </button>
          </div>
        </div>

        {/* FAQ Section (Replica of Gemini Minimal Line Accordion) */}
        <section id="faqs" className="max-w-3xl mx-auto my-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1F1F1F] text-center mb-12">
            Frequently asked questions
          </h2>

          <div className="space-y-0 divide-y divide-[#E3E3E3] border-t border-b border-[#E3E3E3]">
            {faqs.map((faq, index) => (
              <div key={index} className="py-5">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between text-left text-base font-medium text-[#1F1F1F] hover:text-[#1A73E8] transition"
                >
                  <span>{faq.q}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-4 h-4 text-[#5F6368] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#5F6368] shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <p className="mt-3 text-sm text-[#5F6368] leading-relaxed pr-6">
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


