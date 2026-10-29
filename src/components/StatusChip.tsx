import React from 'react';
import { Status } from '../types';

interface StatusChipProps {
  status: Status;
  size?: 'sm' | 'md';
}

export const StatusChip: React.FC<StatusChipProps> = ({ status, size = 'md' }) => {
  const getStyles = () => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'UNDER_PROCESS':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'DISPOSED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'TRANSFERRED':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'ESCALATED':
        return 'bg-rose-100 text-rose-800 border-rose-300 font-semibold';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'PENDING': return 'Pending';
      case 'UNDER_PROCESS': return 'Under Process';
      case 'DISPOSED': return 'Disposed';
      case 'TRANSFERRED': return 'Transferred';
      case 'ESCALATED': return 'Escalated';
      default: return status;
    }
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center rounded-full font-medium border ${getStyles()} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
        status === 'DISPOSED' ? 'bg-emerald-500' :
        status === 'ESCALATED' ? 'bg-rose-500 animate-pulse' :
        status === 'UNDER_PROCESS' ? 'bg-blue-500' :
        status === 'TRANSFERRED' ? 'bg-purple-500' : 'bg-amber-500'
      }`} />
      {getLabel()}
    </span>
  );
};

