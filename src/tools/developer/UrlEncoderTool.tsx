import React, { useState } from 'react';
import { Copy, Trash2, Check, Globe, ArrowRightLeft, AlertCircle } from 'lucide-react';
import { copyToClipboard } from '../../utils/file';
import { SITE_CONFIG } from '../../config/site';

export const UrlEncoderTool: React.FC = () => {
  const [input, setInput] = useState(`${SITE_CONFIG.siteUrl}/search?q=free tools & privacy=100%`);
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [encodeType, setEncodeType] = useState<'component' | 'full'>('component');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleConvert = () => {
    setError(null);
    if (!input) {
      setOutput('');
      return;
    }

    try {
      if (mode === 'encode') {
        const result = encodeType === 'component' ? encodeURIComponent(input) : encodeURI(input);
        setOutput(result);
      } else {
        const result = decodeURIComponent(input);
        setOutput(result);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'URL operation failed';
      setError(`Malformed URL sequence: ${msg}`);
      setOutput('');
    }
  };

  const handleModeToggle = (m: 'encode' | 'decode') => {
    setMode(m);
    setError(null);
    if (output) {
      setInput(output);
      try {
        if (m === 'encode') {
          setOutput(encodeType === 'component' ? encodeURIComponent(output) : encodeURI(output));
        } else {
          setOutput(decodeURIComponent(output));
        }
      } catch {
        setOutput('');
      }
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    const ok = await copyToClipboard(output);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div id="url-encoder-component" className="space-y-6">
      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white rounded-xl border border-stone-200 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switcher */}
          <div className="inline-flex rounded-lg bg-stone-100 p-1 border border-stone-200">
            <button
              type="button"
              onClick={() => handleModeToggle('encode')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                mode === 'encode' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Encode URL
            </button>
            <button
              type="button"
              onClick={() => handleModeToggle('decode')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                mode === 'decode' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Decode URL
            </button>
          </div>

          {mode === 'encode' && (
            <div className="flex items-center gap-1.5 pl-2 border-l border-stone-200 text-xs text-stone-600">
              <span>Scope:</span>
              <select
                value={encodeType}
                onChange={(e) => setEncodeType(e.target.value as 'component' | 'full')}
                className="px-2 py-1 rounded bg-stone-100 border border-stone-200 text-xs font-medium focus:outline-none"
              >
                <option value="component">Component (Query param values &?#/)</option>
                <option value="full">Full URI (Preserves protocol ://)</option>
              </select>
            </div>
          )}

          <button
            type="button"
            onClick={handleConvert}
            className="px-3.5 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 cursor-pointer ml-2"
          >
            {mode === 'encode' ? 'Encode Now' : 'Decode Now'}
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            setInput('');
            setOutput('');
            setError(null);
          }}
          className="p-1.5 text-stone-400 hover:text-rose-600 rounded hover:bg-stone-100 cursor-pointer"
          title="Clear"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden flex flex-col">
          <div className="px-4 py-2.5 bg-stone-50/80 border-b border-stone-200 flex items-center justify-between text-xs text-stone-600 font-medium">
            <span>{mode === 'encode' ? 'Original URL / Query String' : 'Encoded URL (%20, %3D...)'}</span>
            <span className="font-mono text-[11px] text-stone-400">{input.length} chars</span>
          </div>
          <textarea
            id="url-input-textarea"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(null);
            }}
            placeholder="Enter URL to encode or decode..."
            rows={10}
            className="w-full p-4 font-mono text-xs text-stone-800 bg-white focus:outline-none resize-y placeholder:text-stone-400 leading-relaxed"
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden flex flex-col">
          <div className="px-4 py-2 bg-stone-50/80 border-b border-stone-200 flex items-center justify-between text-xs text-stone-600 font-medium">
            <span>{mode === 'encode' ? 'Percent-Encoded Output' : 'Decoded Clean URL'}</span>
            <button
              type="button"
              id="copy-url-btn"
              onClick={handleCopy}
              disabled={!output}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 disabled:opacity-40 text-stone-700 text-xs font-medium cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-stone-500" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <textarea
            id="url-output-textarea"
            value={output}
            readOnly
            placeholder="Result will appear here..."
            rows={10}
            className="w-full p-4 font-mono text-xs text-stone-800 bg-stone-50/40 focus:outline-none resize-y placeholder:text-stone-400 leading-relaxed"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
};
