import React from 'react';

export default function Badge({ status, text }) {
  const label = text || status;
  
  const getStyle = (st) => {
    switch (st?.toUpperCase()) {
      case 'LIVE':
      case 'ACTIVE':
      case 'QUALIFIED':
      case 'SITE_VISIT_BOOKED':
      case 'CONNECTED':
      case 'SUCCESS':
      case 'COMPLETED':
      case 'RUNNING':
        return 'bg-[#E8F0FE] text-[#1A73E8] border-[#1A73E8]/20';
      case 'PAUSED':
      case 'UNQUALIFIED':
      case 'DISCONNECTED':
      case 'FAILED':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border ${getStyle(status)}`}>
      {label}
    </span>
  );
}

