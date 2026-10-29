import React from 'react';
import { Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

interface OverlapBadgeProps {
  confidence?: number;
  overlapGroupId?: string;
  size?: 'sm' | 'md';
}

export const OverlapBadge: React.FC<OverlapBadgeProps> = ({ confidence, overlapGroupId, size = 'sm' }) => {
  if (!confidence || !overlapGroupId) return null;

  const content = (
    <span className={`inline-flex items-center font-medium rounded-full ${
      confidence >= 90 
        ? 'bg-rose-100 text-rose-800 border border-rose-300' 
        : 'bg-amber-100 text-amber-800 border border-amber-300'
    } ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'}`}>
      <Layers className={`${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} mr-1 text-current`} />
      Overlap {confidence}%
    </span>
  );

  return (
    <Link to="/overlaps" title="Click to view cross-bureau overlap analysis" className="hover:opacity-80 transition-opacity">
      {content}
    </Link>
  );
};

