import React, { useState, useMemo } from 'react';
import { Copy, Trash2, Check, WholeWord, Sparkles } from 'lucide-react';
import { copyToClipboard } from '../../utils/file';

export const CharacterCounter: React.FC = () => {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const chars = text.length;
    const letters = (text.match(/[a-zA-Z]/g) || []).length;
    const digits = (text.match(/[0-9]/g) || []).length;
    const spaces = (text.match(/\s/g) || []).length;
    const symbols = chars - letters - digits - spaces;
    const bytes = new Blob([text]).size;

    return {
      chars,
      letters,
      digits,
      spaces,
      symbols: Math.max(0, symbols),
      bytes,
    };
  }, [text]);

  const limits = [
    { name: 'Twitter / X Post', max: 280 },
    { name: 'SEO Title Tag', max: 60 },
    { name: 'Meta Description', max: 160 },
    { name: 'Single SMS Part', max: 160 },
    { name: 'LinkedIn Post Preview', max: 210 },
  ];

  const handleCopy = async () => {
    if (!text) return;
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div id="character-counter-component" className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-stone-400 text-[11px] font-semibold uppercase tracking-wider">Total Characters</div>
          <div className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">{stats.chars}</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-stone-400 text-[11px] font-semibold uppercase tracking-wider">Letters (A-Z)</div>
          <div className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">{stats.letters}</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-stone-400 text-[11px] font-semibold uppercase tracking-wider">Digits (0-9)</div>
          <div className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">{stats.digits}</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-stone-400 text-[11px] font-semibold uppercase tracking-wider">Spaces</div>
          <div className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">{stats.spaces}</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-stone-400 text-[11px] font-semibold uppercase tracking-wider">Symbols</div>
          <div className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">{stats.symbols}</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-stone-400 text-[11px] font-semibold uppercase tracking-wider">UTF-8 Bytes</div>
          <div className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">{stats.bytes}</div>
        </div>
      </div>

      {/* Editor Surface */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-2.5 bg-stone-50/80 border-b border-stone-200 flex items-center justify-between text-xs text-stone-600 font-medium">
          <div className="flex items-center gap-2">
            <WholeWord className="w-3.5 h-3.5 text-stone-500" />
            <span>Character Analysis Editor</span>
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
              onClick={() => setText('')}
              className="p-1.5 text-stone-400 hover:text-rose-600 rounded hover:bg-stone-100 cursor-pointer"
              title="Clear"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <textarea
          id="character-counter-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type text to monitor character and byte limits..."
          rows={9}
          className="w-full p-4 font-sans text-sm text-stone-800 bg-white focus:outline-none resize-y placeholder:text-stone-400 leading-relaxed"
        />
      </div>

      {/* Platform Limits Progress Section */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-2xs space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
          Platform Character Limits
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {limits.map((l, i) => {
            const count = stats.chars;
            const remaining = l.max - count;
            const percent = Math.min(100, Math.round((count / l.max) * 100));
            const isExceeded = remaining < 0;

            return (
              <div key={i} className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-800">{l.name}</span>
                  <span
                    className={`font-mono text-[11px] font-bold ${
                      isExceeded ? 'text-rose-600' : 'text-stone-600'
                    }`}
                  >
                    {count} / {l.max}
                  </span>
                </div>

                <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isExceeded ? 'bg-rose-500' : percent > 85 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-stone-400">{percent}% used</span>
                  <span className={isExceeded ? 'text-rose-600 font-semibold' : 'text-stone-500'}>
                    {isExceeded ? `${Math.abs(remaining)} chars over limit` : `${remaining} chars left`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
