import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate: (path: string) => void;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, onNavigate }) => {
  return (
    <nav id="breadcrumb-navigation" aria-label="Breadcrumb" className="mb-6 flex items-center text-xs text-stone-500 overflow-x-auto whitespace-nowrap py-1">
      <button
        type="button"
        id="breadcrumb-home-btn"
        onClick={() => onNavigate('/')}
        className="flex items-center gap-1 hover:text-stone-900 transition-colors cursor-pointer"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </button>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3 h-3 mx-2 text-stone-300 shrink-0" />
            {isLast || !item.href ? (
              <span id={`breadcrumb-item-${index}`} className="font-medium text-stone-900 truncate max-w-[200px] sm:max-w-none">
                {item.label}
              </span>
            ) : (
              <button
                type="button"
                id={`breadcrumb-item-link-${index}`}
                onClick={() => onNavigate(item.href!)}
                className="hover:text-stone-900 transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
