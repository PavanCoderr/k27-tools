import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface PrivacyBadgeProps {
  text?: string;
  className?: string;
}

export const PrivacyBadge: React.FC<PrivacyBadgeProps> = ({
  text = '100% Client-Side • Your files never leave your browser',
  className = '',
}) => {
  return (
    <div
      id="privacy-security-badge"
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-medium ${className}`}
    >
      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
      <span>{text}</span>
    </div>
  );
};
