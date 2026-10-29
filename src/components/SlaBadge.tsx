import React from 'react';
import { AlertCircle, Clock, CheckCircle } from 'lucide-react';

interface SlaBadgeProps {
  expectedDisposalOn: string;
  isOverdue: boolean;
  status: string;
}

export const SlaBadge: React.FC<SlaBadgeProps> = ({ expectedDisposalOn, isOverdue, status }) => {
  if (status === 'DISPOSED') {
    return (
      <span className="inline-flex items-center text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
        <CheckCircle className="w-3 h-3 mr-1" />
        Completed
      </span>
    );
  }

  // Calculate days remaining
  const today = new Date('2026-10-30'); // System reference time
  const targetDate = new Date(expectedDisposalOn);
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (isOverdue || diffDays < 0) {
    const overdueDays = Math.abs(diffDays);
    return (
      <span className="inline-flex items-center text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-300 animate-pulse">
        <AlertCircle className="w-3 h-3 mr-1 text-rose-600" />
        Overdue by {overdueDays}d
      </span>
    );
  }

  if (diffDays <= 7) {
    return (
      <span className="inline-flex items-center text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
        <Clock className="w-3 h-3 mr-1 text-amber-600" />
        {diffDays} days left
      </span>
    );
  }

  return (
    <span className="inline-flex items-center text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
      <Clock className="w-3 h-3 mr-1 text-emerald-600" />
      {diffDays} days left
    </span>
  );
};

