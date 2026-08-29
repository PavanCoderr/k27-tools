import React, { useState } from 'react';
import { Copy, Download, Trash2, Check, ArrowRightLeft, FileCode, AlertCircle } from 'lucide-react';
import { copyToClipboard, downloadFile } from '../../utils/file';

export const Base64Tool: React.FC = () => {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('K27 Tools: 100% Free, Private & Instant Utility Suite');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Safe Unicode Base64 encoding/decoding
  const encodeBase64 = (str: string) => {
    try {
      const utf8Bytes = new TextEncoder().encode(str);
      let binary = '';
      utf8Bytes.forEach((b) => (binary += String.fromCharCode(b)));
      return btoa(binary);
    } catch {
      throw new Error('Failed to encode string to Base64');
    }
  };

  const decodeBase64 = (str: string) => {
    try {
      const clean = str.replace(/\s/g, '');
      const binary = atob(clean);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return new TextDecoder().decode(bytes);
    } catch {
      throw new Error('Invalid Base64 string. Please verify input data.');
    }
  };

  const handleProcess = () => {
    setError(null);
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      if (mode === 'encode') {
        setOutput(encodeBase64(input));
      } else {
        setOutput(decodeBase64(input));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Processing failed';
      setError(msg);
      setOutput('');
    }
  };

  const handleModeSwitch = (newMode: 'encode' | 'decode') => {
    setMode(newMode);
    setError(null);
    if (output) {
      setInput(output);
      try {
        if (newMode === 'encode') {
          setOutput(encodeBase64(output));
        } else {
          setOutput(decodeBase64(output));
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

  const handleDownload = () => {
    if (!output) return;
    const filename = mode === 'encode' ? 'encoded.b64' : 'decoded.txt';
    downloadFile(output, filename, 'text/plain;charset=utf-8;');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInput(content);
      setError(null);
    };
    reader.readAsText(file);
  };

  return (
    <div id="base64-tool-component" className="space-y-6">
      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white rounded-xl border border-stone-200 shadow-2xs">
        <div className="flex items-center gap-2">
          {/* Mode Switcher Tabs */}
          <div className="inline-flex rounded-lg bg-stone-100 p-1 border border-stone-200">
            <button
              type="button"
              id="base64-mode-encode"
              onClick={() => handleModeSwitch('encode')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                mode === 'encode' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Encode (Text → Base64)
            </button>
            <button
              type="button"
              id="base64-mode-decode"
              onClick={() => handleModeSwitch('decode')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                mode === 'decode' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Decode (Base64 → Text)
            </button>
          </div>

          <button
            type="button"
            onClick={handleProcess}
            className="px-3.5 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 cursor-pointer"
          >
            {mode === 'encode' ? 'Encode Now' : 'Decode Now'}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-600 cursor-pointer font-medium">
            <span>Upload File</span>
            <input type="file" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            type="button"
            onClick={() => {
              setInput('');
              setOutput('');
              setError(null);
            }}
            className="p-1.5 text-stone-400 hover:text-rose-600 rounded hover:bg-stone-100 cursor-pointer"
            title="Clear all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Side-by-side Editors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden flex flex-col">
          <div className="px-4 py-2.5 bg-stone-50/80 border-b border-stone-200 flex items-center justify-between text-xs text-stone-600 font-medium">
            <span>{mode === 'encode' ? 'Raw Text Input (UTF-8)' : 'Base64 Input String'}</span>
            <span className="font-mono text-[11px] text-stone-400">{input.length} chars</span>
          </div>
          <textarea
            id="base64-input-text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(null);
            }}
            placeholder={
              mode === 'encode'
                ? 'Type or paste plain text to encode into Base64...'
                : 'Paste Base64 encoded string to decode into plain text...'
            }
            rows={12}
            className="w-full p-4 font-mono text-xs text-stone-800 bg-white focus:outline-none resize-y placeholder:text-stone-400 leading-relaxed"
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden flex flex-col">
          <div className="px-4 py-2 bg-stone-50/80 border-b border-stone-200 flex items-center justify-between text-xs text-stone-600 font-medium">
            <span>{mode === 'encode' ? 'Base64 Encoded Result' : 'Decoded Plain Text'}</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                id="copy-base64-btn"
                onClick={handleCopy}
                disabled={!output}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 disabled:opacity-40 text-stone-700 text-xs font-medium cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-stone-500" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownload}
                disabled={!output}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 disabled:opacity-40 text-stone-700 text-xs font-medium cursor-pointer"
              >
                <Download className="w-3 h-3 text-stone-500" />
                <span>Download</span>
              </button>
            </div>
          </div>
          <textarea
            id="base64-output-text"
            value={output}
            readOnly
            placeholder="Result will appear here..."
            rows={12}
            className="w-full p-4 font-mono text-xs text-stone-800 bg-stone-50/40 focus:outline-none resize-y placeholder:text-stone-400 leading-relaxed"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
};
