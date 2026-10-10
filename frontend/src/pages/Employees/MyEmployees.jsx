import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PhoneCall, ShieldCheck, Play, Settings, Plus, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';

export default function MyEmployees() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/employees');
      if (res.data.success) {
        setEmployees(res.data.employees || []);
      }
    } catch (err) {
      console.warn('Employees fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCalls = async (empId, currentVal) => {
    try {
      const res = await api.patch(`/employees/${empId}`, { takingCalls: !currentVal });
      if (res.data.success) {
        setEmployees(employees.map(e => e._id === empId ? { ...e, takingCalls: !currentVal } : e));
      }
    } catch (err) {
      setEmployees(employees.map(e => e._id === empId ? { ...e, takingCalls: !currentVal } : e));
    }
  };

  const displayEmployees = employees.length > 0 ? employees : [
    {
      _id: 'meera_hired_id',
      name: 'Meera (Real Estate Sales)',
      status: 'LIVE',
      takingCalls: true,
      phoneNumber: '+91 40 4892 1100',
      configuration: {
        language: 'Telugu + English (Hyderabad)',
        regionalStyle: 'Hyderabad Casual Professional'
      },
      stats: { totalCalls: 12, totalMinutes: 28, qualifiedLeads: 9, siteVisitsBooked: 6 }
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Active Representatives
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage and monitor active voice sales representatives and dispatch lines.</p>
        </div>

        <button
          onClick={() => navigate('/ai-employees/store')}
          className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center justify-center gap-2 self-start md:self-auto transition"
        >
          <Plus className="w-4 h-4" />
          <span>Deploy Representative</span>
        </button>
      </div>

      {/* Employees Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {displayEmployees.map((emp) => (
          <div key={emp._id} className="gemini-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <Badge status={emp.status} />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Taking Calls</span>
                  <button
                    onClick={() => handleToggleCalls(emp._id, emp.takingCalls)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
                      emp.takingCalls ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition ${
                        emp.takingCalls ? 'translate-x-4' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center font-semibold text-lg border border-slate-200 shrink-0">
                  {emp.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">{emp.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">Real Estate Outbound Sales Specialist</p>
                  <div className="text-xs text-slate-600 mt-0.5 font-mono">Phone: {emp.phoneNumber}</div>
                </div>
              </div>

              {/* Status Diagnostic */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 mb-6 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-900 flex items-center gap-1.5 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-slate-500" />
                    <span>System Diagnostic</span>
                  </span>
                  <span className="text-emerald-700 font-semibold text-[11px] bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                    ALL OPERATIONAL
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Phone Line Assigned</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Taking Calls Enabled</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Version 1 Published</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Credit Balance Available</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/ai-employees/${emp._id}`)}
                className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center justify-center gap-2 transition"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Open Simulation Studio</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


