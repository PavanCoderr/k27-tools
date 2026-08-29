import React, { useState } from 'react';
import { Copy, Trash2, Check, Type, Sparkles } from 'lucide-react';
import { copyToClipboard } from '../../utils/file';

export const CaseConverter: React.FC = () => {
  const [text, setText] = useState('Welcome to K27 Tools! High-speed browser utilities.');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const words = text
    .replace(/([a-z])([A-Z])/g, '$1 $2') // split camelCase
    .replace(/[_-]+/g, ' ') // replace snake/kebab
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ');

  const cases = [
    {
      id: 'upper',
      name: 'UPPERCASE',
      desc: 'ALL CAPITAL LETTERS',
      value: text.toUpperCase(),
    },
    {
      id: 'lower',
      name: 'lowercase',
      desc: 'all small letters',
      value: text.toLowerCase(),
    },
    {
      id: 'title',
      name: 'Title Case',
      desc: 'First Letter Of Every Word Capitalized',
      value: text
        .toLowerCase()
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' '),
    },
    {
      id: 'sentence',
      name: 'Sentence case',
      desc: 'First letter of each sentence capitalized',
      value: text
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()),
    },
    {
      id: 'camel',
      name: 'camelCase',
      desc: 'firstWordLowercaseThenCapitalized',
      value: words
        .map((w, i) =>
          i === 0
            ? w.toLowerCase()
            : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
        )
        .join(''),
    },
    {
      id: 'pascal',
      name: 'PascalCase',
      desc: 'EveryWordCapitalizedWithNoSpaces',
      value: words
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(''),
    },
    {
      id: 'snake',
      name: 'snake_case',
      desc: 'words_separated_by_underscores',
      value: words.map((w) => w.toLowerCase()).join('_'),
    },
    {
      id: 'kebab',
      name: 'kebab-case',
      desc: 'words-separated-by-hyphens',
      value: words.map((w) => w.toLowerCase()).join('-'),
    },
    {
      id: 'constant',
      name: 'CONSTANT_CASE',
      desc: 'UPPERCASE_WITH_UNDERSCORES',
      value: words.map((w) => w.toUpperCase()).join('_'),
    },
  ];

  const handleCopy = async (val: string, key: string) => {
    if (!val) return;
    const ok = await copyToClipboard(val);
    if (ok) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const applyCaseToInput = (val: string) => {
    setText(val);
  };

  return (
    <div id="case-converter-component" className="space-y-6">
      {/* Editor Surface */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-2.5 bg-stone-50/80 border-b border-stone-200 flex items-center justify-between text-xs text-stone-600 font-medium">
          <div className="flex items-center gap-2">
            <Type className="w-3.5 h-3.5 text-stone-500" />
            <span>Type or paste your text to convert casing</span>
          </div>

          <button
            type="button"
            onClick={() => setText('')}
            className="p-1 text-stone-400 hover:text-rose-600 rounded hover:bg-stone-100 cursor-pointer"
            title="Clear"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <textarea
          id="case-input-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to instantly see all casing variations..."
          rows={5}
          className="w-full p-4 font-sans text-sm text-stone-800 bg-white focus:outline-none resize-y placeholder:text-stone-400 leading-relaxed"
        />
      </div>

      {/* Grid of Converted Cases */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cases.map((c) => (
          <div
            key={c.id}
            id={`case-card-${c.id}`}
            className="bg-white rounded-xl border border-stone-200 p-4 space-y-2 shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900">{c.name}</span>
                <span className="text-[10px] text-stone-400 font-mono">{c.desc}</span>
              </div>

              <div className="p-2.5 my-2 bg-stone-50 rounded-lg border border-stone-200 text-xs font-mono text-stone-800 break-all max-h-24 overflow-y-auto select-all">
                {c.value || <span className="text-stone-300 italic">Empty text</span>}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => applyCaseToInput(c.value)}
                disabled={!c.value}
                className="px-2.5 py-1 rounded text-xs font-medium text-stone-600 hover:bg-stone-100 disabled:opacity-30 cursor-pointer"
              >
                Apply to Editor
              </button>

              <button
                type="button"
                onClick={() => handleCopy(c.value, c.id)}
                disabled={!c.value}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 disabled:opacity-30 transition-all cursor-pointer"
              >
                {copiedKey === c.id ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-stone-300" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
