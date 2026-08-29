import React from 'react';
import { CATEGORIES, getToolsByCategory } from '../data/tools';
import { ToolCard } from '../components/ToolCard';
import { Breadcrumb } from '../components/Breadcrumb';
import { AdSlot } from '../components/ads/AdSlot';
import { ToolCategory } from '../types';
import { Folder, ArrowRight } from 'lucide-react';

interface CategoryPageProps {
  category: ToolCategory;
  onNavigate: (path: string) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ category, onNavigate }) => {
  const catDef = CATEGORIES.find((c) => c.id === category) || {
    id: category,
    name: category.toUpperCase(),
    description: `All free online ${category} utilities.`,
    icon: 'Folder',
  };

  const tools = getToolsByCategory(category);

  const breadcrumbs = [
    { label: 'Categories', href: '/' },
    { label: `${catDef.name} Tools` },
  ];

  return (
    <div id={`category-page-${category}`} className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <Breadcrumb items={breadcrumbs} onNavigate={onNavigate} />

      {/* Header */}
      <div className="space-y-2 border-b border-stone-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-500">
          <Folder className="w-3.5 h-3.5" />
          <span>Category</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-stone-900">
          {catDef.name} Utilities
        </h1>
        <p className="text-sm text-stone-600 max-w-2xl leading-relaxed">
          {catDef.description} Free, fast, and processed 100% inside your browser.
        </p>
      </div>

      <AdSlot placement="categoryTop" />

      {/* Grid of Tools */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} onSelect={onNavigate} />
        ))}
      </div>

      <AdSlot placement="categoryBottom" />
    </div>
  );
};
