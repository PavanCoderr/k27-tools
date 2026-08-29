import React, { useState } from 'react';
import { Copy, Download, Trash2, Check, AlignLeft, Sparkles, ArrowUpDown, RefreshCw } from 'lucide-react';
import { copyToClipboard, downloadFile } from '../../utils/file';

export const TextFormatter: React.FC = () => {
  const [text, setText] = useState(`  apple  
banana
  apple
cherry
   
date
banana  `);

  const [prefix, setPrefix] = useState('');
  const [suffix, setSuffix] = useState('');
  const [copied, setCopied] = useState(false);

  const handleRemoveExtraSpaces = () => {
    const formatted = text
      .split('\n')
      .map((line) => line.replace(/[ \t]+/g, ' ').trim())
      .join('\n');
    setText(formatted);
  };

  const handleRemoveBlankLines = () => {
    const formatted = text
      .split('\n')
      .filter((line) => line.trim().length > 0)
      .join('\n');
    setText(formatted);
  };

  const handleTrimLines = () => {
    const formatted = text
      .split('\n')
      .map((line) => line.trim())
      .join('\n');
    setText(formatted);
  };

  const handleRemoveDuplicateLines = () => {
    const lines = text.split('\n');
    const unique = Array.from(new Set(lines));
    setText(unique.join('\n'));
  };

  const handleSortAsc = () => {
    const lines = text.split('\n');
    lines.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
    setText(lines.join('\n'));
  };

  const handleSortDesc = () => {
    const lines = text.split('\n');
    lines.sort((a, b) => b.localeCompare(a, undefined, { sensitivity: 'base' }));
    setText(lines.join('\n'));
  };

  const handleReverseLines = () => {
    const lines = text.split('\n').reverse();
    setText(lines.join('\n'));
  };

  const handleReverseCharacters = () => {
    setText(text.split('').reverse().join(''));
  };

  const handleApplyPrefixSuffix = () => {
    if (!prefix && !suffix) return;
    const formatted = text
      .split('\n')
      .map((line) => `${prefix}${line}${suffix}`)
      .join('\n');
    setText(formatted);
  };

  const handleCopy = async () => {
    if (!text) return;
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!text) return;
    downloadFile(text, 'formatted-text.txt', 'text/plain;charset=utf-8;');
  };

  const linesCount = text ? text.split('\n').length : 0;

  return (
    <div id="text-formatter-component" className="space-y-6">
      {/* Quick Cleaning Actions Bar */}
      <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Cleaning & Formatting Tools</span>
          </h3>
          <span className="text-xs text-stone-400 font-mono">{linesCount} lines</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleRemoveExtraSpaces}
            className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium transition-colors cursor-pointer"
          >
            Remove Extra Spaces
          </button>

          <button
            type="button"
            onClick={handleRemoveBlankLines}
            className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium transition-colors cursor-pointer"
          >
            Remove Blank Lines
          </button>

          <button
            type="button"
            onClick={handleTrimLines}
            className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium transition-colors cursor-pointer"
          >
            Trim Lines
          </button>

          <button
            type="button"
            onClick={handleRemoveDuplicateLines}
            className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium transition-colors cursor-pointer"
          >
            Remove Duplicate Lines
          </button>

          <button
            type="button"
            onClick={handleSortAsc}
            className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium transition-colors cursor-pointer"
          >
            Sort A → Z
          </button>

          <button
            type="button"
            onClick={handleSortDesc}
            className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium transition-colors cursor-pointer"
          >
            Sort Z → A
          </button>

          <button
            type="button"
            onClick={handleReverseLines}
            className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium transition-colors cursor-pointer"
          >
            Reverse Line Order
          </button>

          <button
            type="button"
            onClick={handleReverseCharacters}
            className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium transition-colors cursor-pointer"
          >
            Reverse Text
          </button>
        </div>

        {/* Prefix / Suffix inputs */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-stone-100 text-xs">
          <span className="text-stone-500 font-medium">Add to each line:</span>
          <input
            type="text"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            placeholder="Prefix (e.g. - )"
            className="px-2.5 py-1 rounded-md border border-stone-300 text-xs w-28 focus:outline-none"
          />
          <input
            type="text"
            value={suffix}
            onChange={(e) => setSuffix(e.target.value)}
            placeholder="Suffix (e.g. ,)"
            className="px-2.5 py-1 rounded-md border border-stone-300 text-xs w-28 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleApplyPrefixSuffix}
            className="px-3 py-1 rounded-md bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 cursor-pointer"
          >
            Apply to Lines
          </button>
        </div>
      </div>

      {/* Editor Surface */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-2.5 bg-stone-50/80 border-b border-stone-200 flex items-center justify-between text-xs text-stone-600 font-medium">
          <div className="flex items-center gap-2">
            <AlignLeft className="w-3.5 h-3.5 text-stone-500" />
            <span>Text Editor</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!text}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 disabled:opacity-40 text-stone-700 text-xs font-medium cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={!text}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 disabled:opacity-40 text-stone-700 text-xs font-medium cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-stone-500" />
              <span>Download .txt</span>
            </button>

            <button
              type="button"
              onClick={() => setText('')}
              className="p-1.5 text-stone-400 hover:text-rose-600 rounded hover:bg-stone-100 cursor-pointer"
              title="Clear"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <textarea
          id="text-formatter-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text or lists to format and clean..."
          rows={12}
          className="w-full p-4 font-mono text-xs text-stone-800 bg-white focus:outline-none resize-y placeholder:text-stone-400 leading-relaxed"
        />
      </div>
    </div>
  );
};
