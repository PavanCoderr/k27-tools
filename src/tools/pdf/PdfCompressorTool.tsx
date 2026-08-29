import React, { useState, useRef } from 'react';
import { Upload, Download, Minimize2, FileText, Trash2, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { formatBytes, downloadFile } from '../../utils/file';
import { validatePdfFile, validatePdfPageCount } from '../../utils/transform';

export const PdfCompressorTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (uploadedFile: File) => {
    const fileError = validatePdfFile(uploadedFile);
    if (fileError) {
      setError(fileError);
      return;
    }

    setFile(uploadedFile);
    setError(null);
    setCompressedBlob(null);

    // Read page count
    try {
      const buffer = await uploadedFile.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const pageCount = doc.getPageCount();
      const pageError = validatePdfPageCount(pageCount);
      if (pageError) throw new Error(pageError);
      setPageCount(pageCount);
      // Automatically optimize
      optimizePdf(buffer, uploadedFile.size);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid PDF';
      setError(`Failed to read PDF: ${msg}`);
    }
  };

  const optimizePdf = async (arrayBuffer: ArrayBuffer, origSize: number) => {
    setIsCompressing(true);
    setError(null);

    try {
      // Load source PDF and recreate lean structure
      const srcDoc = await PDFDocument.load(arrayBuffer);
      const newDoc = await PDFDocument.create();

      // Copy all pages
      const pages = await newDoc.copyPages(srcDoc, srcDoc.getPageIndices());
      pages.forEach((p) => newDoc.addPage(p));

      // Save with compression & objects stream optimization
      const compressedBytes = await newDoc.save({
        useObjectStreams: true,
      });

      let finalBlob = new Blob([compressedBytes], { type: 'application/pdf' });

      // If the newly generated structure happened to be slightly bigger because of no previous overhead,
      // fallback to original bytes
      if (finalBlob.size >= origSize) {
        finalBlob = new Blob([arrayBuffer], { type: 'application/pdf' });
      }

      setCompressedBlob(finalBlob);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Compression failed';
      setError(`Optimization note: ${msg}`);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDownload = () => {
    if (!compressedBlob || !file) return;
    const name = file.name.replace(/\.pdf$/i, '');
    downloadFile(compressedBlob, `${name}_compressed.pdf`, 'application/pdf');
  };

  const handleClear = () => {
    setFile(null);
    setCompressedBlob(null);
    setError(null);
    setPageCount(0);
  };

  const percentSaved =
    file && compressedBlob
      ? Math.max(0, Math.round(((file.size - compressedBlob.size) / file.size) * 100))
      : 0;

  return (
    <div id="pdf-compressor-component" className="space-y-6">
      {!file ? (
        <div
          id="pdf-compress-dropzone"
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
            <Minimize2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-stone-900">
              Upload PDF to optimize & reduce file size
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Streamlines PDF object streams and structure locally in browser • No file upload limits
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
          <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <FileText className="w-7 h-7 text-rose-600" />
                <div>
                  <div className="text-xs font-bold text-stone-900">{file.name}</div>
                  <div className="text-[11px] text-stone-500">
                    {pageCount} pages • Original size: {formatBytes(file.size)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="download-compressed-pdf-btn"
                  onClick={handleDownload}
                  disabled={!compressedBlob || isCompressing}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 active:scale-95 text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer disabled:opacity-40"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Optimized PDF</span>
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

            {/* Metrics Comparison Banner */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-stone-500">Before:</span>{' '}
                  <span className="font-semibold text-stone-800">{formatBytes(file.size)}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                <div>
                  <span className="text-stone-500">Optimized:</span>{' '}
                  <span className="font-bold text-stone-900">
                    {compressedBlob ? formatBytes(compressedBlob.size) : 'Compressing...'}
                  </span>
                </div>
              </div>

              <div>
                {isCompressing ? (
                  <span className="inline-flex items-center gap-1.5 text-stone-600 font-medium">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Optimizing streams...</span>
                  </span>
                ) : percentSaved > 0 ? (
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                    {percentSaved}% Size Reduction
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-stone-200 text-stone-700 font-medium text-xs">
                    Already fully optimized
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
