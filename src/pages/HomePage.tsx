import React, { useState } from 'react';
import { TOOLS, CATEGORIES, getPopularTools } from '../data/tools';
import { ToolCard } from '../components/ToolCard';
import { AdSlot } from '../components/ads/AdSlot';
import { ToolCategory } from '../types';
import { 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  CheckCircle2, 
  ArrowRight,
  Code2,
  FileText,
  Image as ImageIcon,
  QrCode,
  FileSpreadsheet,
  Lock
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenSearch }) => {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const popularTools = getPopularTools();

  const filteredTools = TOOLS.filter((tool) => {
    const matchesCat = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesQuery =
      !searchQuery.trim() ||
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.tags.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  return (
    <div id="home-page" className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-5 max-w-3xl mx-auto pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-xs font-semibold text-stone-700">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>100% Client-Side • Zero Server Uploads</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-stone-900 leading-tight">
          Simple tools.{' '}
          <span className="text-stone-500 font-normal">Fast results.</span>
        </h1>

        <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-2xl mx-auto">
          Over 20+ privacy-first utility tools for developers, designers, and writers.
          Everything processes entirely inside your browser — zero latency, zero tracking.
        </p>

        {/* Big Search Bar */}
        <div className="pt-2 max-w-xl mx-auto">
          <div
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white border border-stone-300 hover:border-stone-400 shadow-sm cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3 text-stone-400 group-hover:text-stone-600">
              <Search className="w-5 h-5 text-stone-400" />
              <span className="text-xs sm:text-sm text-stone-500">
                Search tools (e.g. JSON Formatter, Image Compress, QR Code)...
              </span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2.5 py-1 rounded-md bg-stone-100 border border-stone-200 text-[11px] font-mono text-stone-500">
              ⌘K
            </kbd>
          </div>
        </div>
      </section>

      {/* Top Ad Slot */}
      <AdSlot placement="homeTop" />

      {/* Popular Tools Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-stone-900">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h2 className="text-lg font-bold tracking-tight">Most Popular Tools</h2>
          </div>
          <span className="text-xs text-stone-400">Frequently used</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} onSelect={onNavigate} />
          ))}
        </div>
      </section>

      {/* Middle Ad Slot */}
      <AdSlot placement="homeMiddle" />

      {/* All Tools with Category Filter */}
      <section id="all-tools" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">
            Browse All Utilities ({TOOLS.length})
          </h2>

          {/* Inline category pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-100 rounded-xl border border-stone-200">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All ({TOOLS.length})
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} onSelect={onNavigate} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 space-y-3">
            <Search className="w-8 h-8 text-stone-400 mx-auto" />
            <div className="text-sm font-semibold text-stone-900">No tools matched your filter</div>
            <p className="text-xs text-stone-500">
              Try searching for a different keyword or resetting your category tab.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-lg bg-stone-900 text-white text-xs font-medium cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Value Proposition Highlights */}
      <section className="mt-12 p-8 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-6">
        <div className="max-w-2xl">
          <h3 className="text-lg font-bold text-stone-900 tracking-tight">
            Why Professionals Choose K27 Tools
          </h3>
          <p className="text-xs text-stone-600 mt-1 leading-relaxed">
            Built for developers, data analysts, content creators, and privacy-conscious users who need fast, reliable utilities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center text-stone-900">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <h4 className="text-xs font-bold text-stone-900">100% Client-Side Privacy</h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              Your sensitive tokens, PDFs, JSON documents, and images never touch remote servers. Everything runs strictly in your browser memory.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center text-stone-900">
              <Zap className="w-5 h-5 text-amber-500" />
            </div>
            <h4 className="text-xs font-bold text-stone-900">Instant Execution</h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              No server cold starts, network latency, or waiting in queue. WebAssembly and HTML5 Web APIs process operations in milliseconds.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center text-stone-900">
              <Lock className="w-5 h-5 text-stone-700" />
            </div>
            <h4 className="text-xs font-bold text-stone-900">Zero Accounts & Always Free</h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              No credit card, no sign-up wall, no usage throttling. Every tool is completely free for individual and commercial use.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom Ad Slot */}
      <AdSlot placement="homeBottom" />
    </div>
  );
};
