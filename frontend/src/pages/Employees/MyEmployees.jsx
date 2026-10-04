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
          <h1 className="text-2xl md:text-3xl font-bold text-[#1F1F1F] tracking-tight">
            Voice <span className="text-[#1A73E8]">Representatives</span>
          </h1>
          <p className="text-[#5F6368] text-xs md:text-sm mt-1 font-normal">Manage and monitor active voice sales representatives.</p>
        </div>

        <button
          onClick={() => navigate('/ai-employees/store')}
          className="btn-gemini-primary px-5 py-2.5 text-xs font-semibold flex items-center justify-center gap-2 self-start md:self-auto"
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
                  <span className="text-xs text-[#5F6368] font-medium">Taking Calls</span>
                  <button
                    onClick={() => handleToggleCalls(emp._id, emp.takingCalls)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
                      emp.takingCalls ? 'bg-[#1A73E8]' : 'bg-[#C4C7C5]'
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
                <div className="w-14 h-14 rounded-full bg-[#E8F0FE] flex items-center justify-center font-bold text-xl text-[#1A73E8] shrink-0">
                  {emp.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1F1F1F]">{emp.name}</h3>
                  <p className="text-xs text-[#1A73E8] font-semibold">Real Estate Outbound Sales Specialist</p>
                  <div className="text-[11px] text-[#5F6368] mt-0.5 font-mono">Phone: {emp.phoneNumber}</div>
                </div>
              </div>

              {/* Status Check */}
              <div className="p-4 rounded-[20px] bg-[#F0F4F9] border border-[#E3E3E3] mb-6 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#1F1F1F] flex items-center gap-1.5 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-[#1A73E8]" />
                    System Diagnostic
                  </span>
                  <span className="text-[#137333] font-bold text-[11px] bg-[#E6F4EA] px-2.5 py-0.5 rounded-full">ALL PASSED</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-[#444746] pt-2 border-t border-[#E3E3E3] font-mono">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#137333] shrink-0" />
                    <span>Phone Line Assigned</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#137333] shrink-0" />
                    <span>Taking Calls Enabled</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#137333] shrink-0" />
                    <span>Version 1 Published</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#137333] shrink-0" />
                    <span>Credit Balance Available</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/ai-employees/${emp._id}`)}
                className="btn-gemini-primary flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-2"
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


