import React, { useState } from 'react';
import { ToolDefinition } from '../types';
import { Breadcrumb } from './Breadcrumb';
import { PrivacyBadge } from './PrivacyBadge';
import { AdSlot } from './ads/AdSlot';
import { ToolCard } from './ToolCard';
import { getRelatedTools } from '../data/tools';
import { getToolIcon } from '../utils/iconHelper';
import { 
  ChevronDown, 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  ListOrdered,
  ArrowRight,
  Code2
} from 'lucide-react';

interface ToolLayoutProps {
  tool: ToolDefinition;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({ tool, onNavigate, children }) => {
  const [openFaqIndices, setOpenFaqIndices] = useState<number[]>([0]); // First FAQ open by default
  const relatedTools = getRelatedTools(tool);

  const toggleFaq = (index: number) => {
    setOpenFaqIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const breadcrumbs = [
    { label: `${tool.category.toUpperCase()} Tools`, href: `/category/${tool.category}` },
    { label: tool.name },
  ];

  return (
    <div id={`tool-page-${tool.slug}`} className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumb items={breadcrumbs} onNavigate={onNavigate} />

      {/* Header Info */}
      <div className="mb-6 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center shadow-xs">
            {getToolIcon(tool.iconName, { className: 'w-5 h-5' })}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                {tool.category} Tool
              </span>
              {tool.isPopular && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 inline-flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Popular
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 mt-1">
              {tool.h1}
            </h1>
          </div>
        </div>

        <p className="text-sm text-stone-600 leading-relaxed max-w-3xl">
          {tool.intro}
        </p>

        <div className="pt-1">
          <PrivacyBadge />
        </div>
      </div>

      {/* Top Ad Slot — below heading, above tool */}
      <AdSlot placement="toolTop" />

      {/* The Interactive Tool Container */}
      <div id="interactive-tool-surface" className="my-6">
        {children}
      </div>

      {/* Middle Ad Slot — between tool and SEO content */}
      <AdSlot placement="toolMiddle" />

      {/* SEO & Educational Content Sections */}
      <div className="mt-16 space-y-12 border-t border-stone-200 pt-12">
        
        {/* Section 1: What is this tool? */}
        <section id="what-is-section" className="space-y-4">
          <div className="flex items-center gap-2 text-stone-900">
            <Sparkles className="w-5 h-5 text-stone-800" />
            <h2 className="text-xl font-bold tracking-tight">
              {tool.whatIsTitle}
            </h2>
          </div>
          <p className="text-sm text-stone-600 leading-relaxed max-w-4xl">
            {tool.whatIsContent}
          </p>
        </section>

        {/* Section 2: How to Use & Key Features Grid */}
        <section id="how-to-use-section" className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* How to use */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 text-stone-900">
              <ListOrdered className="w-5 h-5 text-stone-800" />
              <h3 className="text-base font-semibold">How to Use {tool.name}</h3>
            </div>
            <ol className="space-y-3 text-xs text-stone-600">
              {tool.howToUseSteps.map((step, index) => (
                <li key={index} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-800 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Key Features */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 text-stone-900">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-semibold">Key Features</h3>
            </div>
            <ul className="space-y-2.5 text-xs text-stone-600">
              {tool.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                  <span className="leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

        </section>

        {/* Section 3: Examples (if any) */}
        {tool.examples && tool.examples.length > 0 && (
          <section id="examples-section" className="space-y-4">
            <div className="flex items-center gap-2 text-stone-900">
              <Code2 className="w-5 h-5 text-stone-800" />
              <h3 className="text-lg font-bold tracking-tight">Practical Example</h3>
            </div>
            <div className="space-y-4">
              {tool.examples.map((ex, i) => (
                <div key={i} className="bg-white rounded-xl border border-stone-200 p-5 shadow-2xs space-y-3">
                  <h4 className="text-xs font-semibold text-stone-900">{ex.title}</h4>
                  {ex.description && (
                    <p className="text-xs text-stone-500">{ex.description}</p>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="text-[10px] font-semibold uppercase text-stone-400 mb-1">Input</div>
                      <pre className="p-3 bg-stone-50 rounded-lg border border-stone-200 font-mono text-[11px] overflow-x-auto text-stone-700">
                        {ex.input}
                      </pre>
                    </div>
                    <div>
                      <div className="text-[10px] font-semibold uppercase text-stone-400 mb-1">Output</div>
                      <pre className="p-3 bg-stone-50 rounded-lg border border-stone-200 font-mono text-[11px] overflow-x-auto text-stone-700">
                        {ex.output}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 4: Privacy & Security Guarantee */}
        <section id="privacy-guarantee-section" className="bg-stone-900 text-stone-100 rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero Server Uploads</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                Your Privacy Is Fully Protected
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                {tool.privacyNote} Everything runs locally in your device's browser memory via Web APIs.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/privacy')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-medium text-white border border-stone-700 transition-colors shrink-0 cursor-pointer"
            >
              <span>Learn About Our Privacy</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

        {/* Section 5: FAQ Accordion */}
        {tool.faqs && tool.faqs.length > 0 && (
          <section id="faq-section" className="space-y-4">
            <div className="flex items-center gap-2 text-stone-900">
              <HelpCircle className="w-5 h-5 text-stone-800" />
              <h2 className="text-xl font-bold tracking-tight">Frequently Asked Questions</h2>
            </div>
            
            <div className="space-y-3">
              {tool.faqs.map((faq, index) => {
                const isOpen = openFaqIndices.includes(index);
                return (
                  <div
                    key={index}
                    id={`faq-item-${index}`}
                    className="rounded-xl border border-stone-200 bg-white overflow-hidden shadow-2xs"
                  >
                    <button
                      type="button"
                      id={`faq-question-btn-${index}`}
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between p-4 text-left font-semibold text-xs text-stone-900 hover:bg-stone-50 transition-colors cursor-pointer"
                      aria-expanded={isOpen}
                    >
                      <span className="pr-4">{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-stone-400 shrink-0 transition-transform ${
                          isOpen ? 'rotate-180 text-stone-900' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div
                        id={`faq-answer-${index}`}
                        className="px-4 pb-4 text-xs text-stone-600 leading-relaxed border-t border-stone-100 pt-3"
                      >
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Section 6: Related Tools */}
        {relatedTools.length > 0 && (
          <section id="related-tools-section" className="space-y-4 pt-4 border-t border-stone-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-stone-900">
                Related Utilities
              </h3>
              <button
                type="button"
                onClick={() => onNavigate(`/category/${tool.category}`)}
                className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1 font-medium cursor-pointer"
              >
                <span>View all {tool.category} tools</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedTools.map((rel) => (
                <ToolCard key={rel.slug} tool={rel} onSelect={onNavigate} compact />
              ))}
            </div>
          </section>
        )}

        {/* Bottom Ad Slot — after SEO content, before related tools */}
        <AdSlot placement="toolBottom" />

      </div>
    </div>
  );
};
