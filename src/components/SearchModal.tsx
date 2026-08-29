import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, CornerDownLeft, Sparkles } from 'lucide-react';
import { searchTools, TOOLS } from '../data/tools';
import { ToolDefinition } from '../types';
import { getToolIcon } from '../utils/iconHelper';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  onNavigate: (route: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onOpen, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results: ToolDefinition[] = query.trim() ? searchTools(query) : TOOLS.slice(0, 8);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          onOpen();
        }
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault();
        onNavigate(results[selectedIndex].route);
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onNavigate, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="search-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Search tools"
      className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 px-4 p-6"
      onClick={onClose}
    >
      <div
        id="search-modal-container"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-white rounded-2xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-100"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-stone-200 gap-3">
          <Search className="w-5 h-5 text-stone-400 shrink-0" />
          <input
            ref={inputRef}
            id="global-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all 20+ free tools (e.g. JSON, WebP, Base64, PDF)..."
            className="flex-1 bg-transparent text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-stone-400 hover:text-stone-600 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-stone-400 bg-stone-100 border border-stone-200 rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="text-center py-12 px-4">
              <p className="text-sm text-stone-600 font-medium">No tools found for "{query}"</p>
              <p className="text-xs text-stone-400 mt-1">
                Try searching for general terms like "json", "pdf", "image", or "counter".
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-semibold tracking-wider uppercase text-stone-400 flex items-center justify-between">
                <span>{query.trim() ? 'Matching Tools' : 'Popular Utilities'}</span>
                <span>{results.length} results</span>
              </div>

              {results.map((tool, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    type="button"
                    key={tool.slug}
                    id={`search-result-${tool.slug}`}
                    onClick={() => {
                      onNavigate(tool.route);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-stone-900 text-white'
                        : 'hover:bg-stone-100 text-stone-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-stone-800 text-white'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {getToolIcon(tool.iconName, { className: 'w-4 h-4' })}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold truncate">
                            {tool.name}
                          </span>
                          {tool.isPopular && !isSelected && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200">
                              Popular
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-[11px] truncate ${
                            isSelected ? 'text-stone-300' : 'text-stone-500'
                          }`}
                        >
                          {tool.shortDescription}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded capitalize ${
                          isSelected
                            ? 'bg-stone-800 text-stone-300'
                            : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        {tool.category}
                      </span>
                      {isSelected ? (
                        <CornerDownLeft className="w-3.5 h-3.5 text-stone-300" />
                      ) : (
                        <ArrowRight className="w-3.5 h-3.5 text-stone-300" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1 py-0.5 bg-white border border-stone-200 rounded text-[10px]">↑</kbd> <kbd className="px-1 py-0.5 bg-white border border-stone-200 rounded text-[10px]">↓</kbd> to navigate
            </span>
            <span>
              <kbd className="px-1 py-0.5 bg-white border border-stone-200 rounded text-[10px]">↵</kbd> to select
            </span>
          </div>
          <span>100% Client-Side Search</span>
        </div>
      </div>
    </div>
  );
};
