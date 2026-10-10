import React from 'react';

export default function Badge({ status, text, className = '' }) {
  const label = text || status;
  
  const getStyle = (st) => {
    switch (st?.toUpperCase()) {
      case 'LIVE':
      case 'ACTIVE':
      case 'CONNECTED':
      case 'RUNNING':
        return {
          wrapper: 'bg-emerald-50 text-emerald-700 border-emerald-200/70',
          dot: 'bg-emerald-500'
        };
      case 'QUALIFIED':
      case 'SITE_VISIT_BOOKED':
      case 'QUALIFIED_SITE_VISIT_BOOKED':
      case 'SUCCESS':
      case 'COMPLETED':
        return {
          wrapper: 'bg-blue-50 text-blue-700 border-blue-200/70',
          dot: 'bg-blue-500'
        };
      case 'PAUSED':
      case 'PENDING':
        return {
          wrapper: 'bg-amber-50 text-amber-700 border-amber-200/70',
          dot: 'bg-amber-500'
        };
      case 'UNQUALIFIED':
      case 'DISCONNECTED':
      case 'FAILED':
        return {
          wrapper: 'bg-rose-50 text-rose-700 border-rose-200/70',
          dot: 'bg-rose-500'
        };
      default:
        return {
          wrapper: 'bg-slate-100 text-slate-700 border-slate-200/80',
          dot: 'bg-slate-400'
        };
    }
  };

  const style = getStyle(status);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style.wrapper} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${style.dot}`} />
      {label}
    </span>
  );
}
