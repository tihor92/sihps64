import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  color: 'blue' | 'amber' | 'emerald' | 'rose' | 'purple' | 'slate';
  onClick?: () => void;
  active?: boolean;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  onClick,
  active = false
}) => {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50/50',
      border: 'border-blue-200',
      activeBorder: 'border-blue-500 ring-2 ring-blue-500/20',
      iconBg: 'bg-blue-100 text-blue-700',
      text: 'text-blue-900',
    },
    amber: {
      bg: 'bg-amber-50/50',
      border: 'border-amber-200',
      activeBorder: 'border-amber-500 ring-2 ring-amber-500/20',
      iconBg: 'bg-amber-100 text-amber-700',
      text: 'text-amber-900',
    },
    emerald: {
      bg: 'bg-emerald-50/50',
      border: 'border-emerald-200',
      activeBorder: 'border-emerald-500 ring-2 ring-emerald-500/20',
      iconBg: 'bg-emerald-100 text-emerald-700',
      text: 'text-emerald-900',
    },
    rose: {
      bg: 'bg-rose-50/50',
      border: 'border-rose-200',
      activeBorder: 'border-rose-500 ring-2 ring-rose-500/20',
      iconBg: 'bg-rose-100 text-rose-700',
      text: 'text-rose-900',
    },
    purple: {
      bg: 'bg-purple-50/50',
      border: 'border-purple-200',
      activeBorder: 'border-purple-500 ring-2 ring-purple-500/20',
      iconBg: 'bg-purple-100 text-purple-700',
      text: 'text-purple-900',
    },
    slate: {
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      activeBorder: 'border-slate-500 ring-2 ring-slate-500/20',
      iconBg: 'bg-slate-100 text-slate-700',
      text: 'text-slate-900',
    }
  };

  const current = colorMap[color];

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border bg-white shadow-sm transition-all duration-150 cursor-pointer hover:shadow-md hover:-translate-y-0.5 ${
        active ? current.activeBorder : current.border
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className={`p-2 rounded-lg ${current.iconBg}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <span className={`text-2xl font-bold tracking-tight ${current.text}`}>
          {value}
        </span>
      </div>
      {subtitle && (
        <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
      )}
    </div>
  );
};

