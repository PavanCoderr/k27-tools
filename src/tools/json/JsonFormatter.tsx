import React, { useState } from 'react';
import { Copy, Download, Trash2, Check, AlertCircle, Sparkles, FileCode, Minimize2 } from 'lucide-react';
import { copyToClipboard, downloadFile } from '../../utils/file';

export const JsonFormatter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indentSize, setIndentSize] = useState<number | string>(2);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<{ size: number; lines: number } | null>(null);

  const sampleJson = `{
  "name": "K27 Tools",
  "type": "utility_platform",
  "version": "1.0.0",
  "features": [
    "100% Client-Side",
    "Zero Server Uploads",
    "Ultra Fast"
  ],
  "author": {
    "organization": "K27",
    "openSource": true
  }
}`;

  const handleFormat = (spaceIndent = indentSize) => {
    setError(null);
    if (!input.trim()) {
      setOutput('');
      setStats(null);
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const indent = spaceIndent === 'tab' ? '\t' : Number(spaceIndent);
      const formatted = JSON.stringify(parsed, null, indent);
      setOutput(formatted);
      setStats({
        size: new Blob([formatted]).size,
        lines: formatted.split('\n').length,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid JSON format';
      setError(formatErrorMessage(msg, input));
      setOutput('');
      setStats(null);
    }
  };

  const handleMinify = () => {
    setError(null);
    if (!input.trim()) return;

    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setStats({
        size: new Blob([minified]).size,
        lines: 1,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid JSON format';
      setError(formatErrorMessage(msg, input));
    }
  };

  const handleValidate = () => {
    setError(null);
    if (!input.trim()) {
      setError('Please enter JSON to validate.');
      return;
    }

    try {
      JSON.parse(input);
      setOutput('✅ JSON is 100% Valid (RFC 8259 Standard)');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid JSON';
      setError(formatErrorMessage(msg, input));
    }
  };

  const formatErrorMessage = (message: string, rawText: string) => {
    const match = message.match(/position (\d+)/);
    if (match && match[1]) {
      const pos = parseInt(match[1], 10);
      const lines = rawText.substring(0, pos).split('\n');
      const lineNum = lines.length;
      const colNum = lines[lines.length - 1].length + 1;
      return `Syntax Error at Line ${lineNum}, Column ${colNum}: ${message}`;
    }
    return `Syntax Error: ${message}`;
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
    downloadFile(output, 'formatted-data.json', 'application/json');
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
    setStats(null);
  };

  const handleLoadSample = () => {
    setInput(sampleJson);
    setError(null);
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
    <div id="json-formatter-component" className="space-y-4">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white rounded-xl border border-stone-200 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            id="format-btn"
            onClick={() => handleFormat()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Format JSON</span>
          </button>

          <button
            type="button"
            id="minify-btn"
            onClick={handleMinify}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 text-xs font-medium transition-colors cursor-pointer"
          >
            <Minimize2 className="w-3.5 h-3.5 text-stone-500" />
            <span>Minify</span>
          </button>

          <button
            type="button"
            id="validate-btn"
            onClick={handleValidate}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 text-xs font-medium transition-colors cursor-pointer"
          >
            <span>Validate</span>
          </button>

          {/* Indentation selector */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-stone-200 text-xs text-stone-600">
            <span>Indent:</span>
            <select
              id="indent-selector"
              value={indentSize}
              onChange={(e) => {
                const val = e.target.value;
                setIndentSize(val);
                if (input.trim()) handleFormat(val);
              }}
              className="px-2 py-1 rounded bg-stone-100 border border-stone-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-stone-900"
            >
              <option value={2}>2 Spaces</option>
              <option value={4}>4 Spaces</option>
              <option value="tab">Tab</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLoadSample}
            className="text-xs text-stone-600 hover:text-stone-900 underline font-medium cursor-pointer"
          >
            Load Sample
          </button>

          <label className="text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-600 cursor-pointer font-medium">
            <span>Upload .json</span>
            <input type="file" accept=".json,text/plain" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            type="button"
            id="clear-btn"
            onClick={handleClear}
            className="p-2 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
            title="Clear all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div id="json-error-box" className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="font-mono">{error}</div>
        </div>
      )}

      {/* Editor Surface (Side-by-Side on Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input Panel */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden flex flex-col">
          <div className="px-4 py-2.5 bg-stone-50/80 border-b border-stone-200 flex items-center justify-between text-xs text-stone-600 font-medium">
            <div className="flex items-center gap-2">
              <FileCode className="w-3.5 h-3.5 text-stone-500" />
              <span>Input Raw JSON</span>
            </div>
            <span className="text-[11px] text-stone-400 font-mono">
              {input.length} chars
            </span>
          </div>
          <textarea
            id="json-input-editor"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(null);
            }}
            placeholder="Paste your unformatted JSON here..."
            rows={15}
            className="w-full p-4 font-mono text-xs text-stone-800 bg-white focus:outline-none resize-y placeholder:text-stone-400 leading-relaxed"
            spellCheck={false}
          />
        </div>

        {/* Output Panel */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden flex flex-col">
          <div className="px-4 py-2 bg-stone-50/80 border-b border-stone-200 flex items-center justify-between text-xs text-stone-600 font-medium">
            <div className="flex items-center gap-2">
              <span>Formatted Output</span>
              {stats && (
                <span className="text-[10px] text-stone-400 font-mono">
                  ({stats.lines} lines, {(stats.size / 1024).toFixed(2)} KB)
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                id="copy-json-btn"
                onClick={handleCopy}
                disabled={!output}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 disabled:opacity-40 text-stone-700 text-xs font-medium transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-stone-500" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              <button
                type="button"
                id="download-json-btn"
                onClick={handleDownload}
                disabled={!output}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 disabled:opacity-40 text-stone-700 text-xs font-medium transition-colors cursor-pointer"
              >
                <Download className="w-3 h-3 text-stone-500" />
                <span>Download</span>
              </button>
            </div>
          </div>

          <textarea
            id="json-output-editor"
            value={output}
            readOnly
            placeholder="Formatted JSON will appear here..."
            rows={15}
            className="w-full p-4 font-mono text-xs text-stone-800 bg-stone-50/40 focus:outline-none resize-y placeholder:text-stone-400 leading-relaxed"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
};
