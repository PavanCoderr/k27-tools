import React, { useState } from 'react';
import { Copy, Download, Trash2, Check, AlertCircle, FileSpreadsheet, Sparkles, Table } from 'lucide-react';
import { copyToClipboard, downloadFile } from '../../utils/file';

export const JsonToCsv: React.FC = () => {
  const [input, setInput] = useState('');
  const [csvOutput, setCsvOutput] = useState('');
  const [previewRows, setPreviewRows] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [flattenNested, setFlattenNested] = useState(true);

  const sampleJson = `[
  { "id": 1, "name": "John Doe", "email": "john@example.com", "role": "Developer", "location": "New York" },
  { "id": 2, "name": "Jane Smith", "email": "jane@example.com", "role": "Designer", "location": "San Francisco" },
  { "id": 3, "name": "Alex Kumar", "email": "alex@example.com", "role": "Product Lead", "location": "London" }
]`;

  // Flatten nested objects into dot notation: user.address.city
  const flattenObject = (obj: Record<string, unknown>, prefix = ''): Record<string, unknown> => {
    return Object.keys(obj).reduce((acc: Record<string, unknown>, k: string) => {
      const pre = prefix.length ? prefix + '.' : '';
      if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
        Object.assign(acc, flattenObject(obj[k] as Record<string, unknown>, pre + k));
      } else if (Array.isArray(obj[k])) {
        acc[pre + k] = JSON.stringify(obj[k]);
      } else {
        acc[pre + k] = obj[k];
      }
      return acc;
    }, {});
  };

  const escapeCsvCell = (val: unknown): string => {
    if (val === null || val === undefined) return '';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const handleConvert = () => {
    setError(null);
    if (!input.trim()) {
      setCsvOutput('');
      setPreviewRows([]);
      setHeaders([]);
      return;
    }

    try {
      const parsed = JSON.parse(input);
      let items: Record<string, unknown>[] = [];

      if (Array.isArray(parsed)) {
        items = parsed.map((item) => (typeof item === 'object' && item !== null ? item : { value: item }));
      } else if (typeof parsed === 'object' && parsed !== null) {
        items = [parsed];
      } else {
        throw new Error('Input must be a JSON array of objects or a single JSON object.');
      }

      if (items.length === 0) {
        throw new Error('JSON array is empty.');
      }

      const processedItems = flattenNested
        ? items.map((item) => flattenObject(item))
        : items;

      // Extract all unique headers across all objects
      const allKeys = Array.from(
        new Set(processedItems.flatMap((item) => Object.keys(item)))
      );

      setHeaders(allKeys);

      const headerRow = allKeys.map(escapeCsvCell).join(',');
      const dataRows = processedItems.map((item) =>
        allKeys.map((k) => escapeCsvCell(item[k])).join(',')
      );

      const finalCsv = [headerRow, ...dataRows].join('\n');
      setCsvOutput(finalCsv);

      // Tabular preview (first 10 rows)
      const previewGrid = processedItems.slice(0, 10).map((item) =>
        allKeys.map((k) => String(item[k] ?? ''))
      );
      setPreviewRows(previewGrid);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to parse JSON';
      setError(msg);
      setCsvOutput('');
      setPreviewRows([]);
      setHeaders([]);
    }
  };

  const handleCopy = async () => {
    if (!csvOutput) return;
    const ok = await copyToClipboard(csvOutput);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!csvOutput) return;
    downloadFile(csvOutput, 'converted_data.csv', 'text/csv;charset=utf-8;');
  };

  const handleClear = () => {
    setInput('');
    setCsvOutput('');
    setPreviewRows([]);
    setHeaders([]);
    setError(null);
  };

  return (
    <div id="json-to-csv-component" className="space-y-4">
      {/* Top action toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white rounded-xl border border-stone-200 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            id="convert-csv-btn"
            onClick={handleConvert}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 active:scale-95 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Convert to CSV</span>
          </button>

          <label className="flex items-center gap-1.5 text-xs text-stone-700 font-medium pl-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={flattenNested}
              onChange={(e) => setFlattenNested(e.target.checked)}
              className="rounded text-stone-900 focus:ring-stone-900"
            />
            <span>Flatten nested objects (user.city)</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setInput(sampleJson);
              setError(null);
            }}
            className="text-xs text-stone-600 hover:text-stone-900 underline font-medium cursor-pointer"
          >
            Load Sample Array
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="p-2 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
            title="Clear all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden flex flex-col">
          <div className="px-4 py-2.5 bg-stone-50/80 border-b border-stone-200 flex items-center justify-between text-xs text-stone-600 font-medium">
            <span>Input JSON Array</span>
            <span className="font-mono text-[11px] text-stone-400">
              {input.length} chars
            </span>
          </div>
          <textarea
            id="json-csv-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste JSON array: [ { &quot;id&quot;: 1, &quot;name&quot;: &quot;Alex&quot; }, ... ]"
            rows={13}
            className="w-full p-4 font-mono text-xs text-stone-800 bg-white focus:outline-none resize-y placeholder:text-stone-400 leading-relaxed"
            spellCheck={false}
          />
        </div>

        {/* CSV Raw Output */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden flex flex-col">
          <div className="px-4 py-2 bg-stone-50/80 border-b border-stone-200 flex items-center justify-between text-xs text-stone-600 font-medium">
            <span>CSV Output</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                id="copy-csv-btn"
                onClick={handleCopy}
                disabled={!csvOutput}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 disabled:opacity-40 text-stone-700 text-xs font-medium transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-stone-500" />}
                <span>{copied ? 'Copied!' : 'Copy CSV'}</span>
              </button>

              <button
                type="button"
                id="download-csv-btn"
                onClick={handleDownload}
                disabled={!csvOutput}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 disabled:opacity-40 text-stone-700 text-xs font-medium transition-colors cursor-pointer"
              >
                <Download className="w-3 h-3 text-stone-500" />
                <span>Download .csv</span>
              </button>
            </div>
          </div>
          <textarea
            id="csv-output-textarea"
            value={csvOutput}
            readOnly
            placeholder="CSV format text will appear here..."
            rows={13}
            className="w-full p-4 font-mono text-xs text-stone-800 bg-stone-50/40 focus:outline-none resize-y placeholder:text-stone-400 leading-relaxed"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Table Preview Panel */}
      {previewRows.length > 0 && (
        <div id="table-preview-card" className="bg-white rounded-xl border border-stone-200 p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-900">
              <Table className="w-4 h-4 text-stone-700" />
              <span>Spreadsheet Tabular Preview (First {previewRows.length} rows)</span>
            </div>
            <span className="text-xs text-stone-400">
              {headers.length} columns discovered
            </span>
          </div>

          <div className="overflow-x-auto max-h-60 border border-stone-200 rounded-lg">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-100/80 border-b border-stone-200">
                  {headers.map((h, i) => (
                    <th key={i} className="p-2.5 font-semibold text-stone-800 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {previewRows.map((row, rIndex) => (
                  <tr key={rIndex} className="hover:bg-stone-50/70">
                    {row.map((cell, cIndex) => (
                      <td key={cIndex} className="p-2.5 text-stone-600 whitespace-nowrap max-w-xs truncate font-mono text-[11px]">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
