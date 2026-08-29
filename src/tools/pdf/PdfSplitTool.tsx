import React, { useState, useRef } from 'react';
import { Upload, Download, Scissors, FileText, Trash2, AlertCircle, RefreshCw, Archive } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { formatBytes, downloadFile } from '../../utils/file';
import { parsePageNumbers } from '../../utils/transform';
import { validatePdfFile, validatePdfPageCount } from '../../utils/transform';

export const PdfSplitTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [splitMode, setSplitMode] = useState<'range' | 'all'>('range');
  const [rangeInput, setRangeInput] = useState<string>('1-2');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [downloadReady, setDownloadReady] = useState<{ blob: Blob; filename: string; type: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (uploadedFile: File) => {
    setError(null);
    setDownloadReady(null);

    const fileError = validatePdfFile(uploadedFile);
    if (fileError) {
      setError(fileError);
      return;
    }

    try {
      const buffer = await uploadedFile.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const pages = doc.getPageCount();
      const pageError = validatePdfPageCount(pages);
      if (pageError) throw new Error(pageError);

      setFile(uploadedFile);
      setTotalPages(pages);
      setRangeInput(pages > 1 ? `1-${Math.min(pages, 2)}` : '1');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid PDF';
      setError(`Failed to read PDF document: ${msg}`);
    }
  };

  const handleSplit = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);
    setDownloadReady(null);

    try {
      const buffer = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(buffer);

      if (splitMode === 'range') {
        const pageIndices = parsePageNumbers(rangeInput, totalPages);
        if (pageIndices.length === 0) {
          throw new Error(`No valid pages selected. Document has ${totalPages} pages.`);
        }

        const newDoc = await PDFDocument.create();
        const copiedPages = await newDoc.copyPages(srcDoc, pageIndices);
        copiedPages.forEach((p) => newDoc.addPage(p));

        const bytes = await newDoc.save();
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const name = file.name.replace(/\.pdf$/i, '');
        setDownloadReady({
          blob,
          filename: `${name}_extracted.pdf`,
          type: 'application/pdf',
        });
      } else {
        // Split all pages into a ZIP archive
        const zip = new JSZip();
        const name = file.name.replace(/\.pdf$/i, '');

        for (let i = 0; i < totalPages; i++) {
          const singleDoc = await PDFDocument.create();
          const [copiedPage] = await singleDoc.copyPages(srcDoc, [i]);
          singleDoc.addPage(copiedPage);
          const singleBytes = await singleDoc.save();
          zip.file(`${name}_page_${i + 1}.pdf`, singleBytes);
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        setDownloadReady({
          blob: zipBlob,
          filename: `${name}_all_pages.zip`,
          type: 'application/zip',
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Split failed';
      setError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!downloadReady) return;
    downloadFile(downloadReady.blob, downloadReady.filename, downloadReady.type);
  };

  const handleClear = () => {
    setFile(null);
    setTotalPages(0);
    setDownloadReady(null);
    setError(null);
  };

  return (
    <div id="pdf-split-component" className="space-y-6">
      {!file ? (
        <div
          id="split-dropzone"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files[0];
            if (f) handleFileUpload(f);
          }}
          className="border-2 border-dashed border-stone-300 hover:border-stone-500 bg-white rounded-2xl p-12 text-center transition-all cursor-pointer group flex flex-col items-center justify-center gap-3"
        >
          <div className="w-14 h-14 rounded-2xl bg-stone-100 group-hover:bg-stone-900 group-hover:text-white flex items-center justify-center text-stone-700 transition-colors shadow-2xs">
            <Scissors className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-stone-900">
              Upload PDF document to extract or split pages
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Extract page ranges or split all pages into a ZIP • Fast & 100% private
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFileUpload(f);
            }}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* File Overview Bar */}
          <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-rose-600" />
              <div>
                <div className="text-xs font-bold text-stone-900">{file.name}</div>
                <div className="text-[11px] text-stone-500">
                  {totalPages} total pages • {formatBytes(file.size)}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 text-stone-400 hover:text-rose-600 rounded hover:bg-stone-100 cursor-pointer"
              title="Remove PDF"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Split Mode Selector */}
          <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-4">
            <div className="space-y-3">
              <span className="text-xs font-semibold text-stone-700">Split Method:</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                    splitMode === 'range'
                      ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="splitMode"
                    value="range"
                    checked={splitMode === 'range'}
                    onChange={() => setSplitMode('range')}
                    className="mt-0.5 text-stone-900 focus:ring-stone-900"
                  />
                  <div>
                    <div className="text-xs font-bold text-stone-900">Custom Page Range</div>
                    <div className="text-[11px] text-stone-500 mt-0.5">
                      Extract specific pages (e.g. 1-3, 5) into a single PDF.
                    </div>
                  </div>
                </label>

                <label
                  className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                    splitMode === 'all'
                      ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="splitMode"
                    value="all"
                    checked={splitMode === 'all'}
                    onChange={() => setSplitMode('all')}
                    className="mt-0.5 text-stone-900 focus:ring-stone-900"
                  />
                  <div>
                    <div className="text-xs font-bold text-stone-900">Extract Every Page</div>
                    <div className="text-[11px] text-stone-500 mt-0.5">
                      Separate each page into its own PDF and download a ZIP file.
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Range Input box */}
            {splitMode === 'range' && (
              <div className="pt-3 border-t border-stone-100 space-y-1.5">
                <label className="block text-xs font-semibold text-stone-700">
                  Page Selection (1 to {totalPages})
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={rangeInput}
                    onChange={(e) => setRangeInput(e.target.value)}
                    placeholder="e.g. 1-3, 5, 7-10"
                    className="flex-1 max-w-sm px-3 py-2 rounded-lg border border-stone-300 text-xs font-mono focus:ring-1 focus:ring-stone-900 focus:outline-none"
                  />
                  <span className="text-[11px] text-stone-400">
                    Use commas and dashes (e.g. 1-2, 4)
                  </span>
                </div>
              </div>
            )}

            {/* Execute Split Button */}
            <div className="pt-3 border-t border-stone-100 flex justify-end">
              <button
                type="button"
                id="execute-split-btn"
                onClick={handleSplit}
                disabled={isProcessing}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 active:scale-95 text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer disabled:opacity-40"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing Pages...</span>
                  </>
                ) : (
                  <>
                    <Scissors className="w-3.5 h-3.5" />
                    <span>Split PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Download ready card */}
          {downloadReady && (
            <div className="p-5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 flex flex-wrap items-center justify-between gap-4 animate-in fade-in">
              <div className="space-y-1">
                <div className="text-xs font-bold text-emerald-800">
                  🎉 PDF Pages Successfully Extracted!
                </div>
                <div className="text-xs text-emerald-700">
                  File: {downloadReady.filename} ({formatBytes(downloadReady.blob.size)})
                </div>
              </div>

              <button
                type="button"
                id="download-split-pdf-btn"
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download {splitMode === 'all' ? 'ZIP Archive' : 'Extracted PDF'}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
