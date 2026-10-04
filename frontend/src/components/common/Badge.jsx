import React from 'react';

export default function Badge({ status, text }) {
  const label = text || status;
  
  const getStyle = (st) => {
    switch (st?.toUpperCase()) {
      case 'LIVE':
      case 'ACTIVE':
      case 'CONNECTED':
      case 'RUNNING':
        return 'bg-[#E8F0FE] text-[#1A73E8] border-[#D2E3FC]';
      case 'QUALIFIED':
      case 'SITE_VISIT_BOOKED':
      case 'QUALIFIED_SITE_VISIT_BOOKED':
      case 'SUCCESS':
      case 'COMPLETED':
        return 'bg-[#E6F4EA] text-[#137333] border-[#CEEAD6]';
      case 'PAUSED':
      case 'PENDING':
        return 'bg-[#FEF7E0] text-[#B06000] border-[#FDE293]';
      case 'UNQUALIFIED':
      case 'DISCONNECTED':
      case 'FAILED':
        return 'bg-[#FCE8E6] text-[#C5221F] border-[#FAD2CF]';
      default:
        return 'bg-[#F0F4F9] text-[#5F6368] border-[#E3E3E3]';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold font-mono tracking-tight border ${getStyle(status)}`}>
      {label}
    </span>
  );
}


