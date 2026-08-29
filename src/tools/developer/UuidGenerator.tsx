import React, { useState, useEffect } from 'react';
import { Copy, Download, RefreshCw, Check, Hash, Sparkles } from 'lucide-react';
import { copyToClipboard, downloadFile } from '../../utils/file';
import { generateUuid } from '../../utils/transform';

export const UuidGenerator: React.FC = () => {
  const [count, setCount] = useState<number>(5);
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [hyphens, setHyphens] = useState<boolean>(true);
  const [braces, setBraces] = useState<boolean>(false);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  const generateSingleUuid = (): string => {
    let id = generateUuid();

    if (!hyphens) {
      id = id.replace(/-/g, '');
    }
    if (uppercase) {
      id = id.toUpperCase();
    }
    if (braces) {
      id = `{${id}}`;
    }
    return id;
  };

  const handleGenerate = (newCount = count) => {
    const list: string[] = [];
    for (let i = 0; i < newCount; i++) {
      list.push(generateSingleUuid());
    }
    setUuids(list);
  };

  // Generate on first mount and when options change
  useEffect(() => {
    handleGenerate(count);
  }, [count, uppercase, hyphens, braces]);

  const handleCopyOne = async (val: string, index: number) => {
    const ok = await copyToClipboard(val);
    if (ok) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    }
  };

  const handleCopyAll = async () => {
    const allText = uuids.join('\n');
    const ok = await copyToClipboard(allText);
    if (ok) {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    }
  };

  const handleDownload = () => {
    downloadFile(uuids.join('\n'), 'uuids.txt', 'text/plain;charset=utf-8;');
  };

  return (
    <div id="uuid-generator-component" className="space-y-6">
      {/* Control Panel */}
      <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Quantity selection */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-700">Quantity:</span>
            <div className="flex gap-1">
              {[1, 5, 10, 25, 50].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setCount(num)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    count === num
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Regenerate Button */}
          <button
            type="button"
            id="regenerate-uuids-btn"
            onClick={() => handleGenerate(count)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 active:scale-95 text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Regenerate Fresh UUIDs</span>
          </button>
        </div>

        {/* Format toggles */}
        <div className="flex flex-wrap items-center gap-5 pt-3 border-t border-stone-100 text-xs font-medium text-stone-700">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="rounded text-stone-900 focus:ring-stone-900"
            />
            <span>UPPERCASE</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={hyphens}
              onChange={(e) => setHyphens(e.target.checked)}
              className="rounded text-stone-900 focus:ring-stone-900"
            />
            <span>Include Hyphens (-)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={braces}
              onChange={(e) => setBraces(e.target.checked)}
              className="rounded text-stone-900 focus:ring-stone-900"
            />
            <span>Wrap in Braces {'{...}'}</span>
          </label>
        </div>
      </div>

      {/* Output List */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-2.5 bg-stone-50/80 border-b border-stone-200 flex items-center justify-between text-xs text-stone-600 font-medium">
          <div className="flex items-center gap-2">
            <Hash className="w-3.5 h-3.5 text-stone-500" />
            <span>Generated UUIDs ({uuids.length})</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="copy-all-uuids-btn"
              onClick={handleCopyAll}
              className="inline-flex items-center gap-1 px-3 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium cursor-pointer"
            >
              {copiedAll ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-stone-500" />}
              <span>{copiedAll ? 'Copied All' : 'Copy All'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1 px-3 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium cursor-pointer"
            >
              <Download className="w-3 h-3 text-stone-500" />
              <span>Download .txt</span>
            </button>
          </div>
        </div>

        <div className="divide-y divide-stone-100 max-h-[420px] overflow-y-auto">
          {uuids.map((uuid, idx) => (
            <div
              key={idx}
              className="p-3.5 flex items-center justify-between hover:bg-stone-50/80 transition-colors group"
            >
              <span className="font-mono text-xs text-stone-800 selection:bg-stone-900 selection:text-white">
                {uuid}
              </span>

              <button
                type="button"
                onClick={() => handleCopyOne(uuid, idx)}
                className="opacity-80 group-hover:opacity-100 inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-stone-100 border border-stone-200 text-[11px] font-medium text-stone-700 transition-all cursor-pointer"
              >
                {copiedIndex === idx ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-stone-400" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
