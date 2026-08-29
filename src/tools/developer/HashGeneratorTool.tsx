import React, { useState, useEffect, useRef } from 'react';
import { Copy, Trash2, Check, Hash, Sparkles, FileText, Upload } from 'lucide-react';
import { copyToClipboard } from '../../utils/file';

export const HashGeneratorTool: React.FC = () => {
  const [input, setInput] = useState('K27 Tools: Simple tools. Fast results.');
  const [uppercase, setUppercase] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [hashes, setHashes] = useState<{
    sha256: string;
    sha384: string;
    sha512: string;
    sha1: string;
  }>({
    sha256: '',
    sha384: '',
    sha512: '',
    sha1: '',
  });
  const computationId = useRef(0);

  const computeHashes = async (text: string) => {
    const currentId = ++computationId.current;
    if (!text) {
      setHashes({ sha256: '', sha384: '', sha512: '', sha1: '' });
      return;
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    const bufferToHex = (buffer: ArrayBuffer) => {
      const byteArray = new Uint8Array(buffer);
      return Array.from(byteArray)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    };

    try {
      const [sha256Buf, sha384Buf, sha512Buf, sha1Buf] = await Promise.all([
        crypto.subtle.digest('SHA-256', data),
        crypto.subtle.digest('SHA-384', data),
        crypto.subtle.digest('SHA-512', data),
        crypto.subtle.digest('SHA-1', data),
      ]);

      if (currentId !== computationId.current) return;
      setHashes({
        sha256: bufferToHex(sha256Buf),
        sha384: bufferToHex(sha384Buf),
        sha512: bufferToHex(sha512Buf),
        sha1: bufferToHex(sha1Buf),
      });
    } catch {
      console.error('SubtleCrypto error');
    }
  };

  useEffect(() => {
    computeHashes(input);
  }, [input]);

  const handleCopy = async (hashVal: string, key: string) => {
    const textToCopy = uppercase ? hashVal.toUpperCase() : hashVal.toLowerCase();
    const ok = await copyToClipboard(textToCopy);
    if (ok) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInput(content);
    };
    reader.readAsText(file);
  };

  const hashItems = [
    { key: 'sha256', label: 'SHA-256 (Industry Standard 256-bit)', value: hashes.sha256 },
    { key: 'sha512', label: 'SHA-512 (High Security 512-bit)', value: hashes.sha512 },
    { key: 'sha384', label: 'SHA-384 (384-bit Checksum)', value: hashes.sha384 },
    { key: 'sha1', label: 'SHA-1 (Legacy 160-bit)', value: hashes.sha1 },
  ];

  return (
    <div id="hash-generator-component" className="space-y-6">
      {/* Input Editor */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-2.5 bg-stone-50/80 border-b border-stone-200 flex items-center justify-between text-xs text-stone-600 font-medium">
          <div className="flex items-center gap-2">
            <Hash className="w-3.5 h-3.5 text-stone-500" />
            <span>Input String or File</span>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs px-2 py-1 rounded border border-stone-200 hover:bg-stone-100 text-stone-600 cursor-pointer font-medium">
              <span>Upload File</span>
              <input type="file" onChange={handleFileUpload} className="hidden" />
            </label>

            <button
              type="button"
              onClick={() => setInput('')}
              className="p-1 text-stone-400 hover:text-rose-600 rounded hover:bg-stone-100 cursor-pointer"
              title="Clear"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <textarea
          id="hash-input-textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste text to compute cryptographic hashes..."
          rows={5}
          className="w-full p-4 font-mono text-xs text-stone-800 bg-white focus:outline-none resize-y placeholder:text-stone-400 leading-relaxed"
        />
      </div>

      {/* Format options */}
      <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-stone-200 shadow-2xs text-xs">
        <label className="flex items-center gap-2 font-medium text-stone-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={uppercase}
            onChange={(e) => setUppercase(e.target.checked)}
            className="rounded text-stone-900 focus:ring-stone-900"
          />
          <span>Uppercase Hexadecimal Format (A-F)</span>
        </label>
        <span className="text-stone-400">Standard Web Cryptography API</span>
      </div>

      {/* Hash Results Cards */}
      <div className="space-y-3">
        {hashItems.map((item) => {
          const displayVal = uppercase ? item.value.toUpperCase() : item.value.toLowerCase();
          return (
            <div
              key={item.key}
              id={`hash-card-${item.key}`}
              className="bg-white rounded-xl border border-stone-200 p-4 space-y-2 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900">{item.label}</span>
                <span className="text-[10px] text-stone-400 font-mono">
                  {displayVal.length * 4} bits ({displayVal.length} hex chars)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 p-2.5 bg-stone-50 rounded-lg border border-stone-200 font-mono text-xs text-stone-800 break-all select-all">
                  {displayVal || <span className="text-stone-300 italic">No input</span>}
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(item.value, item.key)}
                  disabled={!item.value}
                  className="inline-flex items-center gap-1 px-3 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 active:scale-95 text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer disabled:opacity-30 shrink-0"
                >
                  {copiedKey === item.key ? (
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
          );
        })}
      </div>
    </div>
  );
};
