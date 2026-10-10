import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PhoneCall, 
  Calendar, 
  Wallet, 
  ArrowUpRight, 
  Play, 
  ChevronRight,
  Activity,
  BarChart2,
  PieChart as PieIcon
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
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
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Overview of workforce performance, voice calls, and site visits.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 font-medium shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Meera Live</span>
          </div>
          <button
            onClick={() => navigate('/ai-employees/' + (meeraEmp._id || 'meera'))}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition shadow-2xs"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Open Studio</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="gemini-card p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">Active Workers</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">1 Active</div>
            <div className="text-xs text-slate-500 mt-1">Meera (Live)</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center text-slate-600">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="gemini-card p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">Calls Completed</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">{meeraEmp.stats?.totalCalls || 12}</div>
            <div className="text-xs text-slate-500 mt-1">{meeraEmp.stats?.totalMinutes || 28} billed minutes</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center text-slate-600">
            <PhoneCall className="w-5 h-5" />
          </div>
        </div>

        <div className="gemini-card p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">Site Visits Booked</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">{meeraEmp.stats?.siteVisitsBooked || 6}</div>
            <div className="text-xs text-slate-500 mt-1">75% qualification rate</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center text-slate-600">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="gemini-card p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">Wallet Balance</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">₹{(wallet?.balance || 500).toFixed(2)}</div>
            <div className="text-xs text-slate-500 mt-1">Rate: ₹3.50 / min</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center text-slate-600">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Active Employee & Recent Calls */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active Employee Detail Card */}
        <div className="lg:col-span-1 gemini-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Active Representative</span>
              <Badge status={meeraEmp.status || 'LIVE'} text="Online" />
            </div>

            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-base shrink-0">
                {meeraEmp.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">{meeraEmp.name || 'Meera'}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Real Estate Sales Representative</p>
              </div>
            </div>

            <div className="space-y-2 mb-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Inbound Status</span>
                <span className="text-slate-800 font-medium">Online (Ready)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Phone Line</span>
                <span className="text-slate-800 font-medium">{meeraEmp.phoneNumber || '+91 40 4892 1100'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Dialect</span>
                <span className="text-slate-800 font-medium">Telugu + English (Hyd)</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/ai-employees/' + (meeraEmp._id || 'meera'))}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center justify-center gap-1.5 transition mt-2"
          >
            <span>Configure Representative</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Recent Lead Call Activity Feed */}
        <div className="lg:col-span-2 gemini-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Recent Calls & Outcomes</h3>
                <p className="text-xs text-slate-500 mt-0.5">Live transcripts and extracted lead qualification data</p>
              </div>
              <button
                onClick={() => navigate('/calls')}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition"
              >
                <span>View all</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Featured Call Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 transition">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-xs">Rahul Sharma</span>
                    <span className="text-xs text-slate-500">+91 98765 43210</span>
                  </div>
                  <Badge status="SITE_VISIT_BOOKED" text="Site Visit: Sunday 11 AM" />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Enquired for 3BHK Gachibowli (Budget ₹1.5 Cr). Meera addressed hospital proximity requirements and scheduled Sunday 11 AM site visit. Sent WhatsApp brochure.
                </p>
                <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-200/70 pt-2.5">
                  <div className="flex items-center gap-3">
                    <span>Duration: 2m 18s</span>
                    <span>Cost: ₹10.50</span>
                  </div>
                  <button
                    onClick={() => navigate('/calls')}
                    className="text-blue-600 hover:text-blue-700 font-medium text-xs transition"
                  >
                    View transcript →
                  </button>
                </div>
              </div>

              {/* Sample Call 2 */}
              <div className="p-4 rounded-xl bg-slate-50/60 border border-slate-200/80">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-xs">Suresh Kumar</span>
                    <span className="text-xs text-slate-500">+91 91234 56789</span>
                  </div>
                  <Badge status="QUALIFIED" text="Qualified Follow-Up" />
                </div>
                <p className="text-xs text-slate-600">
                  Enquired about 2BHK Kondapur (Budget ₹95L). Meera verified possession date (June 2026) and scheduled callback for tomorrow.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Showing recent activity for ABC Properties</span>
            <span>Usage rate: ₹3.50/min</span>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Chart 1: Call Volume & Minutes Trend */}
        <div className="md:col-span-2 gemini-card p-6 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-slate-500" />
              <h3 className="text-sm font-semibold text-slate-900">Voice Call Volume & Conversion Trend</h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">Past 7 Days</span>
          </div>
          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { day: 'Mon', calls: 14, siteVisits: 8 },
                { day: 'Tue', calls: 22, siteVisits: 12 },
                { day: 'Wed', calls: 18, siteVisits: 10 },
                { day: 'Thu', calls: 28, siteVisits: 16 },
                { day: 'Fri', calls: 35, siteVisits: 21 },
                { day: 'Sat', calls: 42, siteVisits: 29 },
                { day: 'Sun', calls: 39, siteVisits: 26 }
              ]}>
                <defs>
                  <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    borderColor: '#E2E8F0', 
                    borderRadius: '10px', 
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)' 
                  }} 
                />
                <Area type="monotone" dataKey="calls" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorCalls)" name="Total Voice Calls" />
                <Area type="monotone" dataKey="siteVisits" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorVisits)" name="Booked Site Visits" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Customer Sentiment & Objection Breakdown */}
        <div className="gemini-card p-6 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <PieIcon className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-semibold text-slate-900">Lead Outcome Distribution</h3>
          </div>
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Site Visit Booked', value: 52, color: '#2563EB' },
                    { name: 'Price / Budget Follow-up', value: 24, color: '#F59E0B' },
                    { name: 'Family Proximity', value: 16, color: '#10B981' },
                    { name: 'Project Comparison', value: 8, color: '#64748B' }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={72}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {[
                    { color: '#2563EB' },
                    { color: '#F59E0B' },
                    { color: '#10B981' },
                    { color: '#64748B' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    borderColor: '#E2E8F0', 
                    borderRadius: '10px', 
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)' 
                  }} 
                />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '11px', color: '#64748B' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
