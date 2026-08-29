import React, { useState, useRef } from 'react';
import { Upload, Download, FileText, ArrowUp, ArrowDown, Trash2, Layers, AlertCircle, RefreshCw } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { formatBytes, downloadFile } from '../../utils/file';
import { validatePdfFile, validatePdfPageCount } from '../../utils/transform';

interface PdfFileItem {
  id: string;
  file: File;
  pageCount: number | null;
  size: number;
}

export const PdfMergeTool: React.FC = () => {
  const [files, setFiles] = useState<PdfFileItem[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergedBlob, setMergedBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesAdded = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setError(null);
    setMergedBlob(null);

    const newItems: PdfFileItem[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const f = fileList[i];
      if (!validatePdfFile(f)) {
        let pages: number | null = null;
        try {
          const buffer = await f.arrayBuffer();
          const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
          pages = doc.getPageCount();
          const pageError = validatePdfPageCount(pages);
          if (pageError) continue;
        } catch (e) {
          console.warn('Could not read page count', e);
        }

        newItems.push({
          id: Math.random().toString(36).substring(2, 9),
          file: f,
          pageCount: pages,
          size: f.size,
        });
      }
    }

    if (newItems.length === 0) {
      setError('Please select valid PDF documents.');
      return;
    }

    setFiles((prev) => [...prev, ...newItems]);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setFiles((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
    setMergedBlob(null);
  };

  const moveDown = (index: number) => {
    if (index === files.length - 1) return;
    setFiles((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
    setMergedBlob(null);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setMergedBlob(null);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Please add at least 2 PDF documents to merge.');
      return;
    }

    setIsMerging(true);
    setError(null);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const item of files) {
        const arrayBuffer = await item.file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setMergedBlob(blob);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'PDF merge failed';
      setError(`Failed to merge PDFs: ${msg}. Make sure files are not password-protected.`);
    } finally {
      setIsMerging(false);
    }
  };

  const handleDownload = () => {
    if (!mergedBlob) return;
    downloadFile(mergedBlob, 'merged_document.pdf', 'application/pdf');
  };

  const totalPages = files.reduce((acc, f) => acc + (f.pageCount || 0), 0);
  const totalSize = files.reduce((acc, f) => acc + f.size, 0);

  return (
    <div id="pdf-merge-component" className="space-y-6">
      {/* Upload Dropzone */}
      <div
        id="pdf-dropzone"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFilesAdded(e.dataTransfer.files);
        }}
        className="border-2 border-dashed border-stone-300 hover:border-stone-500 bg-white rounded-2xl p-8 text-center transition-all cursor-pointer group flex flex-col items-center justify-center gap-3"
      >
        <div className="w-12 h-12 rounded-2xl bg-stone-100 group-hover:bg-stone-900 group-hover:text-white flex items-center justify-center text-stone-700 transition-colors shadow-2xs">
          <Layers className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-stone-900">
            Click to upload PDF files or drag and drop
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Merge multiple PDF files into one in your chosen order • 100% private browser processing
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          multiple
          onChange={(e) => handleFilesAdded(e.target.files)}
          className="hidden"
        />
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Files List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
            <div className="text-xs">
              <span className="font-bold text-stone-900">{files.length} PDFs Added</span>
              <span className="text-stone-400 mx-2">•</span>
              <span className="text-stone-600">{totalPages} total pages</span>
              <span className="text-stone-400 mx-2">•</span>
              <span className="text-stone-600">{formatBytes(totalSize)}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                id="merge-action-btn"
                onClick={handleMerge}
                disabled={files.length < 2 || isMerging}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 active:scale-95 text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer disabled:opacity-40"
              >
                {isMerging ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Merging locally...</span>
                  </>
                ) : (
                  <>
                    <Layers className="w-3.5 h-3.5" />
                    <span>Merge {files.length} PDFs</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setFiles([]);
                  setMergedBlob(null);
                }}
                className="p-2 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                title="Clear all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Merge Result Success Card */}
          {mergedBlob && (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 flex items-center justify-between gap-4 animate-in fade-in">
              <div className="space-y-0.5">
                <div className="font-bold text-xs text-emerald-800">
                  ✅ Successfully Merged {files.length} Documents!
                </div>
                <div className="text-xs text-emerald-700">
                  Ready to download ({formatBytes(mergedBlob.size)}, {totalPages} pages)
                </div>
              </div>

              <button
                type="button"
                id="download-merged-pdf-btn"
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Merged PDF</span>
              </button>
            </div>
          )}

          {/* Draggable/Reorderable items */}
          <div className="space-y-2">
            {files.map((item, idx) => (
              <div
                key={item.id}
                className="p-3.5 bg-white rounded-xl border border-stone-200 shadow-2xs flex items-center justify-between gap-4 hover:border-stone-300 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center font-bold text-xs shrink-0">
                    {idx + 1}
                  </div>
                  <FileText className="w-5 h-5 text-rose-500 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-stone-900 truncate">
                      {item.file.name}
                    </div>
                    <div className="text-[11px] text-stone-500">
                      {item.pageCount ? `${item.pageCount} pages` : 'Reading pages...'} • {formatBytes(item.size)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 disabled:opacity-20 rounded cursor-pointer"
                    title="Move up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => moveDown(idx)}
                    disabled={idx === files.length - 1}
                    className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 disabled:opacity-20 rounded cursor-pointer"
                    title="Move down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => removeFile(item.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-stone-100 rounded cursor-pointer ml-1"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
