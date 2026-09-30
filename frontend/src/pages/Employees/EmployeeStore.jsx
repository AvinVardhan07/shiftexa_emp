import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Plus, Activity, Layers } from 'lucide-react';
import api from '../../services/api';
import Modal from '../../components/common/Modal';

export default function EmployeeStore() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [hiringTemplate, setHiringTemplate] = useState(null);
  const [employeeName, setEmployeeName] = useState('');
  const [hiring, setHiring] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await api.get('/employee-templates');
      if (res.data.success) {
        setTemplates(res.data.templates);
      }
    } catch (err) {
      console.warn('Fallback store templates:', err.message);
      setTemplates([
        {
          _id: 'tmpl_meera',
          code: 'meera',
          name: 'Meera',
          title: 'Real Estate Sales Representative',
          category: 'Real Estate',
          ratePerMin: 3.50,
          supportedLanguages: ['Telugu', 'English', 'Hinglish'],
          isFeatured: true,
          description: 'Specialized in Indian real estate lead qualification, Telugu & English Hyderabad conversational dialogue, price objection handling, project pricing, site visit scheduling, and automated WhatsApp follow-ups.',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          capabilities: [
            'Natural Telugu + English (Hyderabad code-switching)',
            'Budget & location qualification',
            'Empathy & price hesitation handling',
            'Google Calendar site visit slot booking',
            'WhatsApp brochure & confirmation sending'
          ]
        },
        {
          _id: 'tmpl_riya',
          code: 'riya',
          name: 'Riya',
          title: 'Receptionist & Appointment Specialist',
          category: 'Reception',
          ratePerMin: 3.00,
          supportedLanguages: ['English', 'Hindi'],
          description: 'Handles inbound desk calls, screens inquiries, routes calls to team members, and manages calendar appointments.',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
          capabilities: ['Inbound call routing', 'FAQ answering', 'Appointment booking']
        },
        {
          _id: 'tmpl_anu',
          code: 'anu',
          name: 'Anu',
          title: 'Education & Admissions Counselor',
          category: 'Education',
          ratePerMin: 3.50,
          supportedLanguages: ['English', 'Telugu', 'Hindi'],
          description: 'Counsels prospective students, collects academic requirements, explains course fee structures, and schedules campus visits.',
          avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
          capabilities: ['Course counseling', 'Eligibility screening', 'Campus visit booking']
        }
      ]);
    }
  };

  const handleOpenHireModal = (tmpl) => {
    setHiringTemplate(tmpl);
    setEmployeeName(`${tmpl.name} (ABC Properties)`);
  };

  const handleHireSubmit = async (e) => {
    e.preventDefault();
    if (!hiringTemplate) return;

    setHiring(true);
    try {
      const res = await api.post('/employees', {
        templateId: hiringTemplate._id,
        name: employeeName
      });

      setHiring(false);
      if (res.data.success) {
        setHiringTemplate(null);
        navigate(`/ai-employees/${res.data.employee._id}`);
      }
    } catch (err) {
      setHiring(false);
      navigate('/ai-employees');
    }
  };

  const filteredTemplates = selectedCategory === 'ALL'
    ? templates
    : templates.filter(t => t.category?.toUpperCase() === selectedCategory.toUpperCase());

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F0FE] text-[#1A73E8] text-xs font-bold mb-2">
            <span>SOLUTIONS MARKETPLACE</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1F1F1F] tracking-tight">Browse <span className="text-[#1A73E8]">Workforce Solutions</span></h1>
          <p className="text-[#5F6368] text-xs md:text-sm mt-1 font-normal">Select pre-configured digital representatives for your business workflows.</p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          {['ALL', 'Real Estate', 'Reception', 'Education'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-[#1A73E8] text-white shadow-none'
                  : 'bg-white text-[#1F1F1F] border border-[#747775] hover:bg-[#F8F9FA]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((tmpl) => (
          <div
            key={tmpl._id}
            className="gemini-card p-6 flex flex-col justify-between relative group"
          >
            {tmpl.isFeatured && (
              <span className="absolute top-5 right-5 px-2.5 py-0.5 rounded-full bg-[#E8F0FE] text-[#1A73E8] text-[9px] font-bold">
                FEATURED V1
              </span>
            )}

            <div>
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#E8F0FE] flex items-center justify-center text-[#1A73E8] font-bold text-lg">
                  {tmpl.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1F1F1F] group-hover:text-[#1A73E8] transition">{tmpl.name}</h3>
                  <p className="text-[11px] text-[#1A73E8] font-semibold">{tmpl.title}</p>
                  <span className="inline-block text-[10px] font-mono font-semibold text-[#1A73E8] bg-[#E8F0FE] px-2 py-0.5 rounded-full mt-1">
                    ₹{tmpl.ratePerMin}/min
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#5F6368] leading-relaxed mb-4 font-normal">{tmpl.description}</p>

              {/* Capabilities */}
              <div className="space-y-2 mb-6">
                <span className="text-[10px] font-semibold text-[#5F6368] uppercase tracking-wider block">Key Features</span>
                {tmpl.capabilities?.slice(0, 4).map((cap, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-[#444746] font-normal">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1A73E8] shrink-0" />
                    <span>{cap}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleOpenHireModal(tmpl)}
              className="btn-gemini-primary w-full py-3 text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Deploy {tmpl.name}</span>
            </button>
          </div>
        ))}
      </div>

      {/* Hire Modal */}
      <Modal
        isOpen={!!hiringTemplate}
        onClose={() => setHiringTemplate(null)}
        title={`Deploy ${hiringTemplate?.name} Representative`}
      >
        <form onSubmit={handleHireSubmit} className="space-y-4 font-sans">
          <div className="flex items-center gap-3.5 p-3.5 rounded-[20px] bg-[#F0F4F9] border border-[#E3E3E3]">
            <div className="w-10 h-10 rounded-full bg-[#E8F0FE] flex items-center justify-center text-[#1A73E8] font-bold text-base">
              {hiringTemplate?.name?.charAt(0)}
            </div>
            <div>
              <h4 className="font-bold text-[#1F1F1F] text-sm">{hiringTemplate?.name}</h4>
              <p className="text-xs text-[#1A73E8] font-semibold">{hiringTemplate?.title}</p>
              <div className="text-[11px] text-[#5F6368] font-mono mt-0.5">Rate: ₹{hiringTemplate?.ratePerMin}/min</div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F1F1F] mb-1">Representative Name / Tag</label>
            <input
              type="text"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-[12px] border border-[#747775] text-sm text-[#1F1F1F] font-normal focus:outline-none focus:border-[#1A73E8]"
              placeholder="e.g. Meera - Real Estate Sales"
            />
          </div>

          <div className="p-3.5 rounded-[16px] bg-[#E8F0FE] border border-[#1A73E8]/20 text-xs text-[#1F1F1F] space-y-1">
            <div className="font-semibold text-[#1A73E8]">Next Steps</div>
            <p className="text-[#5F6368] text-[11px] leading-relaxed font-normal">
              A dedicated representative instance will be initialized for <strong>ABC Properties</strong>. You will be able to customize business knowledge, FAQs, dialing options, and test call immediately.
            </p>
          </div>

          <button
            type="submit"
            disabled={hiring}
            className="btn-gemini-primary w-full py-3 text-xs font-semibold flex items-center justify-center gap-2"
          >
            {hiring ? 'Initializing Instance...' : `Confirm Deployment`}
          </button>
        </form>
      </Modal>
    </div>
  );
}

