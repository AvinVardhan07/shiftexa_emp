import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PhoneCall, 
  Calendar, 
  Wallet, 
  ArrowUpRight, 
  Play, 
  ChevronRight,
  Plus,
  Users,
  Activity
} from 'lucide-react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';

export default function Dashboard() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [calls, setCalls] = useState([]);
  const [leads, setLeads] = useState([]);
  const [wallet, setWallet] = useState({ balance: 500.00 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [empRes, callRes, leadRes, billRes] = await Promise.all([
        api.get('/employees').catch(() => ({ data: { success: false } })),
        api.get('/calls').catch(() => ({ data: { success: false } })),
        api.get('/leads').catch(() => ({ data: { success: false } })),
        api.get('/billing').catch(() => ({ data: { success: false } })),
      ]);

      if (empRes.data?.success) setEmployees(empRes.data.employees || []);
      if (callRes.data?.success) setCalls(callRes.data.calls || []);
      if (leadRes.data?.success) setLeads(leadRes.data.leads || []);
      if (billRes.data?.success && billRes.data.wallet) setWallet(billRes.data.wallet);
    } catch (err) {
      console.warn('Dashboard data fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fallback demo employee if empty
  const meeraEmp = employees.length > 0 ? employees[0] : {
    _id: 'meera_demo_id',
    name: 'Meera (Real Estate Sales)',
    status: 'LIVE',
    takingCalls: true,
    phoneNumber: '+91 40 4892 1100',
    configuration: { language: 'Telugu + English (Hyderabad)' },
    stats: { totalCalls: 12, totalMinutes: 28, qualifiedLeads: 9, siteVisitsBooked: 6 }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Banner / Greeting */}
      <div className="p-7 rounded-[28px] bg-[#F0F4F9] border border-[#E3E3E3] relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F0FE] text-[#1A73E8] text-xs font-bold mb-3">
              <span>ABC PROPERTIES OPERATIONS</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#1F1F1F] tracking-tight">
              Welcome back, <span className="text-[#1A73E8]">Sales Team</span>
            </h1>
            <p className="text-[#5F6368] text-xs md:text-sm mt-2 max-w-xl leading-relaxed font-normal">
              Representative <strong className="text-[#1F1F1F] font-semibold">Meera</strong> is actively contacting leads, handling customer inquiries, and scheduling site visits.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/ai-employees/' + (meeraEmp._id || 'meera'))}
              className="px-5 py-2.5 rounded-full bg-[#1A73E8] hover:bg-[#1557B0] text-white text-xs font-semibold flex items-center gap-2 transition shadow-none"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Test Call Studio</span>
            </button>
            <button
              onClick={() => navigate('/ai-employees/store')}
              className="px-5 py-2.5 rounded-full bg-white hover:bg-[#F8F9FA] text-[#1F1F1F] border border-[#747775] text-xs font-semibold transition"
            >
              Add Representative
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="gemini-card p-5 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#5F6368] font-medium uppercase tracking-wider">Active Workers</span>
            <div className="text-xl font-bold text-[#1F1F1F] mt-1">1 Active</div>
            <div className="text-[11px] text-[#1A73E8] font-semibold mt-1 flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1A73E8] animate-pulse"></span>
              Meera (LIVE - Online)
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#E8F0FE] flex items-center justify-center text-[#1A73E8]">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="gemini-card p-5 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#5F6368] font-medium uppercase tracking-wider">Calls Completed</span>
            <div className="text-xl font-bold text-[#1F1F1F] mt-1">{meeraEmp.stats?.totalCalls || 12} Calls</div>
            <div className="text-[11px] text-[#1A73E8] font-semibold mt-1 font-mono">
              ~{meeraEmp.stats?.totalMinutes || 28} Billed Mins
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#E8F0FE] flex items-center justify-center text-[#1A73E8]">
            <PhoneCall className="w-5 h-5" />
          </div>
        </div>

        <div className="gemini-card p-5 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#5F6368] font-medium uppercase tracking-wider">Site Visits Booked</span>
            <div className="text-xl font-bold text-[#1A73E8] mt-1">{meeraEmp.stats?.siteVisitsBooked || 6} Visits</div>
            <div className="text-[11px] text-[#5F6368] font-medium mt-1 font-mono">
              75% Qualification
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#E8F0FE] flex items-center justify-center text-[#1A73E8]">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="gemini-card p-5 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#5F6368] font-medium uppercase tracking-wider">Wallet Balance</span>
            <div className="text-xl font-bold text-[#1F1F1F] mt-1 font-mono">₹{(wallet?.balance || 500).toFixed(2)}</div>
            <div className="text-[11px] text-[#5F6368] font-medium mt-1 font-mono">
              Rate: ₹3.50 / min
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#E8F0FE] flex items-center justify-center text-[#1A73E8]">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Active Employee & Recent Calls */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active Employee Detail Card */}
        <div className="lg:col-span-1 gemini-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1A73E8]">Active Representative</span>
              <Badge status={meeraEmp.status || 'LIVE'} />
            </div>

            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#E8F0FE] flex items-center justify-center text-[#1A73E8] font-bold text-lg">
                {meeraEmp.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1F1F1F]">{meeraEmp.name || 'Meera'}</h3>
                <p className="text-xs text-[#1A73E8] font-medium">Real Estate Sales Representative</p>
                <div className="text-[11px] text-[#5F6368] mt-0.5">Org: <strong className="text-[#1F1F1F]">ABC Properties</strong></div>
              </div>
            </div>

            <div className="space-y-2.5 my-4 text-xs text-[#1F1F1F]">
              <div className="p-3 rounded-[16px] bg-[#F0F4F9] border border-[#E3E3E3] flex items-center justify-between">
                <span className="text-[#5F6368]">Inbound Status</span>
                <span className="font-semibold text-[#1A73E8] flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1A73E8]"></span> ONLINE
                </span>
              </div>
              <div className="p-3 rounded-[16px] bg-[#F0F4F9] border border-[#E3E3E3] flex items-center justify-between">
                <span className="text-[#5F6368]">Phone Line</span>
                <span className="font-mono text-[#1F1F1F] font-semibold">{meeraEmp.phoneNumber || '+91 40 4892 1100'}</span>
              </div>
              <div className="p-3 rounded-[16px] bg-[#F0F4F9] border border-[#E3E3E3] flex items-center justify-between">
                <span className="text-[#5F6368]">Dialect</span>
                <span className="text-[#1A73E8] font-semibold">Telugu + English (Hyd)</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/ai-employees/' + (meeraEmp._id || 'meera'))}
            className="w-full py-3 rounded-full bg-[#1A73E8] hover:bg-[#1557B0] text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition shadow-none"
          >
            <span>Configure Representative Studio</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Recent Lead Call Activity Feed */}
        <div className="lg:col-span-2 gemini-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#1F1F1F]">Recent Lead Calls & Outcomes</h3>
                <p className="text-xs text-[#5F6368]">Live call transcripts, summaries, and extracted lead data</p>
              </div>
              <button
                onClick={() => navigate('/calls')}
                className="text-xs font-semibold text-[#1A73E8] hover:underline flex items-center gap-1"
              >
                <span>View All Calls</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Featured Call Card */}
              <div className="p-4 rounded-[20px] bg-[#F0F4F9] border border-[#E3E3E3] transition">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#1F1F1F] text-xs">Rahul Sharma</span>
                    <span className="text-xs font-mono text-[#5F6368]">+91 98765 43210</span>
                  </div>
                  <Badge status="SITE_VISIT_BOOKED" text="Site Visit Booked: Sunday 11 AM" />
                </div>
                <p className="text-xs text-[#444746] leading-relaxed mb-3 font-normal">
                  <strong className="text-[#1A73E8]">Call Summary:</strong> Enquired for 3BHK Gachibowli (Budget ₹1.5 Cr). Expressed price hesitation and parents medical proximity requirements. Meera provided consultative guidance and booked Sunday 11 AM site visit. WhatsApp brochure delivered.
                </p>
                <div className="flex items-center justify-between text-[11px] text-[#5F6368] border-t border-[#E3E3E3] pt-2">
                  <div className="flex items-center gap-3 font-mono">
                    <span>Duration: <strong className="text-[#1F1F1F]">2m 18s</strong></span>
                    <span>Cost: <strong className="text-[#1A73E8]">₹10.50</strong></span>
                    <span>Worker: <strong className="text-[#1F1F1F]">Meera</strong></span>
                  </div>
                  <button
                    onClick={() => navigate('/calls')}
                    className="text-[#1A73E8] hover:underline font-semibold text-[11px]"
                  >
                    View Full Transcript →
                  </button>
                </div>
              </div>

              {/* Sample Call 2 */}
              <div className="p-3.5 rounded-[16px] bg-[#F0F4F9]/60 border border-[#E3E3E3]">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#1F1F1F] text-xs">Suresh Kumar</span>
                    <span className="text-xs font-mono text-[#5F6368]">+91 91234 56789</span>
                  </div>
                  <Badge status="QUALIFIED" text="Qualified Follow-Up" />
                </div>
                <p className="text-xs text-[#5F6368]">
                  Enquired about 2BHK Kondapur (Budget ₹95L). Meera explained possession date (June 2026) and home loan pre-approval. Requested callback tomorrow.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E3E3E3] flex items-center justify-between text-[11px] text-[#5F6368]">
            <span>Showing recent activity for <strong className="text-[#1F1F1F]">ABC Properties</strong></span>
            <span className="text-[#1A73E8] font-semibold font-mono">₹3.50/min usage rate applied</span>
          </div>
        </div>
      </div>
    </div>
  );
}

