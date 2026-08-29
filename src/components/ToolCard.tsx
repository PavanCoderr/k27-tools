import React from 'react';
import { ToolDefinition } from '../types';
import { getToolIcon } from '../utils/iconHelper';
import { ArrowRight, Sparkles } from 'lucide-react';

interface ToolCardProps {
  tool: ToolDefinition;
  onSelect: (route: string) => void;
  compact?: boolean;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onSelect, compact = false }) => {
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'json':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'image':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'text':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'developer':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'pdf':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'qr':
        return 'bg-violet-50 text-violet-700 border-violet-200';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  if (compact) {
    return (
      <div
        id={`tool-card-${tool.slug}`}
        onClick={() => onSelect(tool.route)}
        className="group relative flex items-center justify-between p-3.5 rounded-xl border border-stone-200 bg-white hover:border-stone-400 hover:shadow-xs transition-all cursor-pointer"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-stone-100 group-hover:bg-stone-900 group-hover:text-white flex items-center justify-center text-stone-700 transition-colors shrink-0">
            {getToolIcon(tool.iconName, { className: 'w-4 h-4' })}
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-semibold text-stone-900 group-hover:text-stone-900 truncate">
              {tool.name}
            </h4>
            <p className="text-[11px] text-stone-500 truncate">
              {tool.shortDescription}
            </p>
          </div>
        </div>
        <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-900 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
      </div>
    );
  }

  return (
    <div
      id={`tool-card-${tool.slug}`}
      onClick={() => onSelect(tool.route)}
      className="group relative flex flex-col justify-between p-5 rounded-xl border border-stone-200 bg-white hover:border-stone-400 hover:shadow-sm transition-all cursor-pointer h-full"
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="w-10 h-10 rounded-xl bg-stone-100 group-hover:bg-stone-900 group-hover:text-white flex items-center justify-center text-stone-700 transition-colors shrink-0">
            {getToolIcon(tool.iconName, { className: 'w-5 h-5' })}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {tool.isPopular && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                <Sparkles className="w-2.5 h-2.5" />
                Popular
              </span>
            )}
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wider border ${getCategoryColor(tool.category)}`}>
              {tool.category}
            </span>
          </div>
        </div>

        <h3 className="text-sm font-semibold text-stone-900 group-hover:text-stone-900 mb-1.5">
          {tool.name}
        </h3>
        
        <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
          {tool.shortDescription}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-medium text-stone-600 group-hover:text-stone-900">
        <span>Use Tool</span>
        <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-900 group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  );
};
