import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Plus, Activity, Layers } from 'lucide-react';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import JellyRadio from '../../components/common/JellyRadio';

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
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Voice Representatives</h1>
          <p className="text-sm text-slate-500 mt-1">Pre-configured conversational voice agents tailored for enterprise workflows.</p>
        </div>

        {/* Category Filters */}
        <div className="overflow-x-auto pb-2 md:pb-0">
          <JellyRadio
            items={['ALL', 'Real Estate', 'Reception', 'Education']}
            value={selectedCategory}
            onChange={(cat) => setSelectedCategory(cat)}
            size="sm"
            activeColor="#2563EB"
            activeTextColor="#FFFFFF"
            chipColor="#F1F5F9"
            textColor="#334155"
          />
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
              <span className="absolute top-5 right-5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-semibold tracking-wide">
                FEATURED
              </span>
            )}

            <div>
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-11 h-11 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center font-semibold text-base border border-slate-200">
                  {tmpl.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">{tmpl.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">{tmpl.title}</p>
                  <span className="inline-block text-[11px] font-medium text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md mt-1">
                    ₹{tmpl.ratePerMin.toFixed(2)}/min
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-5 font-normal">{tmpl.description}</p>

              {/* Capabilities */}
              <div className="space-y-2 mb-6">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Key Capabilities</span>
                {tmpl.capabilities?.slice(0, 4).map((cap, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{cap}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleOpenHireModal(tmpl)}
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition"
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
          <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-800 font-semibold text-sm">
              {hiringTemplate?.name?.charAt(0)}
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 text-sm">{hiringTemplate?.name}</h4>
              <p className="text-xs text-slate-500">{hiringTemplate?.title}</p>
              <div className="text-xs text-slate-600 mt-0.5">Rate: ₹{hiringTemplate?.ratePerMin?.toFixed(2)}/min</div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Representative Name / Tag</label>
            <input
              type="text"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. Meera - Real Estate Sales"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="font-semibold text-slate-900">Provisioning Details</div>
            <p className="text-xs text-slate-500 leading-relaxed">
              A dedicated representative instance will be initialized for ABC Properties with custom knowledge parameters, FAQs, and test call studio access.
            </p>
          </div>

          <button
            type="submit"
            disabled={hiring}
            className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center justify-center gap-2 transition"
          >
            {hiring ? 'Initializing Instance...' : `Confirm Deployment`}
          </button>
        </form>
      </Modal>
    </div>
  );
}

