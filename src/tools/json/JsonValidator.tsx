import React, { useState } from 'react';
import { CheckCircle2, XCircle, Trash2, Check, Copy, Code, Layers, FileText } from 'lucide-react';
import { copyToClipboard } from '../../utils/file';

interface JsonStats {
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';
  keysCount: number;
  depth: number;
  byteSize: number;
  elementsCount?: number;
}

export const JsonValidator: React.FC = () => {
  const [input, setInput] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [errorDetails, setErrorDetails] = useState<{ line: number; column: number; message: string } | null>(null);
  const [stats, setStats] = useState<JsonStats | null>(null);
  const [copied, setCopied] = useState(false);

  const calculateDepth = (obj: unknown): number => {
    if (obj === null || typeof obj !== 'object') return 0;
    const values = Object.values(obj as Record<string, unknown>);
    if (values.length === 0) return 1;
    return 1 + Math.max(...values.map(calculateDepth));
  };

  const countKeys = (obj: unknown): number => {
    if (obj === null || typeof obj !== 'object') return 0;
    let count = Array.isArray(obj) ? 0 : Object.keys(obj as object).length;
    for (const key of Object.keys(obj as object)) {
      const val = (obj as Record<string, unknown>)[key];
      if (typeof val === 'object' && val !== null) {
        count += countKeys(val);
      }
    }
    return count;
  };

  const handleValidate = (value = input) => {
    if (!value.trim()) {
      setIsValid(null);
      setErrorDetails(null);
      setStats(null);
      return;
    }

    try {
      const parsed = JSON.parse(value);
      setIsValid(true);
      setErrorDetails(null);

      const rootType = Array.isArray(parsed) ? 'array' : (typeof parsed as JsonStats['type']);
      setStats({
        type: rootType,
        keysCount: countKeys(parsed),
        depth: calculateDepth(parsed),
        byteSize: new Blob([value]).size,
        elementsCount: Array.isArray(parsed) ? parsed.length : undefined,
      });
    } catch (err: unknown) {
      setIsValid(false);
      setStats(null);
      const msg = err instanceof Error ? err.message : 'Invalid JSON format';

      let line = 1;
      let column = 1;
      const match = msg.match(/position (\d+)/);
      if (match && match[1]) {
        const pos = parseInt(match[1], 10);
        const lines = value.substring(0, pos).split('\n');
        line = lines.length;
        column = lines[lines.length - 1].length + 1;
      }

      setErrorDetails({
        line,
        column,
        message: msg,
      });
    }
  };

  const handleClear = () => {
    setInput('');
    setIsValid(null);
    setErrorDetails(null);
    setStats(null);
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard(input);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const sampleValid = `[
  {
    "id": 1,
    "product": "Mechanical Keyboard",
    "inStock": true,
    "specs": {
      "switches": "Cherry MX Blue",
      "keycaps": "PBT Double-shot"
    }
  }
]`;

  return (
    <div id="json-validator-component" className="space-y-4">
      {/* Top action toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white rounded-xl border border-stone-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            id="validate-json-btn"
            onClick={() => handleValidate()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 active:scale-95 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Validate Syntax</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setInput(sampleValid);
              setIsValid(null);
              setErrorDetails(null);
            }}
            className="text-xs text-stone-600 hover:text-stone-900 underline font-medium cursor-pointer ml-2"
          >
            Load Sample JSON
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!input}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-stone-200 text-stone-700 text-xs font-medium hover:bg-stone-100 disabled:opacity-40"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="p-2 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
            title="Clear"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Validation Status Indicator */}
      {isValid === true && (
        <div id="valid-result-banner" className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2 animate-in fade-in">
          <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Valid JSON Structure (RFC 8259 Compliant)</span>
          </div>
          <p className="text-xs text-emerald-700">
            Your JSON payload was successfully parsed without any syntax anomalies or unclosed tokens.
          </p>

          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-emerald-200 text-xs text-emerald-800">
              <div>
                <span className="font-semibold">Root Type:</span> {stats.type}
              </div>
              <div>
                <span className="font-semibold">Max Depth:</span> {stats.depth} levels
              </div>
              <div>
                <span className="font-semibold">Total Keys:</span> {stats.keysCount}
              </div>
              <div>
                <span className="font-semibold">Byte Size:</span> {(stats.byteSize / 1024).toFixed(2)} KB
              </div>
            </div>
          )}
        </div>
      )}

      {isValid === false && errorDetails && (
        <div id="invalid-result-banner" className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 space-y-2 animate-in fade-in">
          <div className="flex items-center gap-2 font-bold text-sm text-rose-800">
            <XCircle className="w-5 h-5 text-rose-600" />
            <span>Invalid JSON Syntax Detected</span>
          </div>
          <div className="p-3 bg-white rounded-lg border border-rose-200 font-mono text-xs text-rose-700 space-y-1">
            <div className="font-bold text-rose-900">
              Location: Line {errorDetails.line}, Column {errorDetails.column}
            </div>
            <div>Error: {errorDetails.message}</div>
          </div>
          <p className="text-[11px] text-rose-700">
            Check for missing double quotes around keys, trailing commas after the last item, or unclosed braces.
          </p>
        </div>
      )}

      {/* Editor Surface */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-2.5 bg-stone-50/80 border-b border-stone-200 flex items-center justify-between text-xs text-stone-600 font-medium">
          <span>JSON Syntax Input</span>
          <span className="font-mono text-[11px] text-stone-400">
            {input ? `${input.split('\n').length} lines` : '0 lines'}
          </span>
        </div>
        <textarea
          id="validator-textarea"
          value={input}
          onChange={(e) => {
            const value = e.target.value;
            setInput(value);
            if (isValid !== null) handleValidate(value);
          }}
          placeholder="Paste JSON string here to check syntax validity..."
          rows={14}
          className="w-full p-4 font-mono text-xs text-stone-800 bg-white focus:outline-none resize-y placeholder:text-stone-400 leading-relaxed"
          spellCheck={false}
        />
      </div>
    </div>
  );
};
