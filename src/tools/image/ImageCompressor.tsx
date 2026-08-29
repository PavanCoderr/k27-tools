import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, Sparkles, Image as ImageIcon, Trash2, ArrowRight, RefreshCw } from 'lucide-react';
import { formatBytes, downloadFile } from '../../utils/file';
import { validateImageDimensions, validateImageFile } from '../../utils/transform';

export const ImageCompressor: React.FC = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [originalDimensions, setOriginalDimensions] = useState<{ w: number; h: number } | null>(null);

  const [quality, setQuality] = useState<number>(75);
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/webp' | 'image/png'>('image/jpeg');
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const fileError = validateImageFile(file);
    if (fileError) {
      alert(fileError);
      return;
    }

    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    setOriginalFile(file);
    setOriginalSize(file.size);
    const url = URL.createObjectURL(file);
    setOriginalUrl(url);

    // Read dimensions
    const img = new Image();
    img.onload = () => {
      if (validateImageDimensions(img.width, img.height)) {
        URL.revokeObjectURL(url);
        setOriginalUrl(null);
        setOriginalFile(null);
        alert('Images larger than 40 megapixels are not supported.');
        return;
      }
      setOriginalDimensions({ w: img.width, h: img.height });
      // Compress automatically with initial settings
      processCompression(img, quality, outputFormat);
    };
    img.src = url;
  };

  const processCompression = (
    imgElement: HTMLImageElement,
    qPercent: number,
    mimeType: string
  ) => {
    setIsCompressing(true);

    const canvas = document.createElement('canvas');
    canvas.width = imgElement.width;
    canvas.height = imgElement.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setIsCompressing(false);
      return;
    }

    // Fill white background for non-alpha formats
    if (mimeType === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.drawImage(imgElement, 0, 0);

    const qualityDecimal = qPercent / 100;
    canvas.toBlob(
      (blob) => {
        if (blob) {
          if (compressedUrl) URL.revokeObjectURL(compressedUrl);
          const newUrl = URL.createObjectURL(blob);
          setCompressedBlob(blob);
          setCompressedUrl(newUrl);
        }
        setIsCompressing(false);
      },
      mimeType,
      qualityDecimal
    );
  };

  const recompress = (newQuality: number, newFormat = outputFormat) => {
    if (!originalUrl) return;
    const img = new Image();
    img.onload = () => {
      processCompression(img, newQuality, newFormat);
    };
    img.src = originalUrl;
  };

  const handleQualityChange = (newVal: number) => {
    setQuality(newVal);
    recompress(newVal, outputFormat);
  };

  const handleFormatChange = (fmt: 'image/jpeg' | 'image/webp' | 'image/png') => {
    setOutputFormat(fmt);
    recompress(quality, fmt);
  };

  const handleDownload = () => {
    if (!compressedBlob || !originalFile) return;
    const ext = outputFormat === 'image/jpeg' ? 'jpg' : outputFormat === 'image/webp' ? 'webp' : 'png';
    const nameWithoutExt = originalFile.name.substring(0, originalFile.name.lastIndexOf('.')) || originalFile.name;
    downloadFile(compressedBlob, `${nameWithoutExt}-compressed.${ext}`, outputFormat);
  };

  const handleClear = () => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    setOriginalFile(null);
    setOriginalUrl(null);
    setCompressedBlob(null);
    setCompressedUrl(null);
    setOriginalDimensions(null);
  };

  useEffect(() => () => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
  }, [originalUrl]);

  useEffect(() => () => {
    if (compressedUrl) URL.revokeObjectURL(compressedUrl);
  }, [compressedUrl]);

  const percentReduction =
    originalSize && compressedBlob
      ? Math.max(0, Math.round(((originalSize - compressedBlob.size) / originalSize) * 100))
      : 0;

  return (
    <div id="image-compressor-component" className="space-y-6">
      {/* Upload Zone (when no image) */}
      {!originalFile ? (
        <div
          id="image-dropzone"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
          className="border-2 border-dashed border-stone-300 hover:border-stone-500 bg-white rounded-2xl p-12 text-center transition-all cursor-pointer group flex flex-col items-center justify-center gap-3"
        >
          <div className="w-14 h-14 rounded-2xl bg-stone-100 group-hover:bg-stone-900 group-hover:text-white flex items-center justify-center text-stone-700 transition-colors shadow-2xs">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-stone-900">
              Click to upload or drag & drop image
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Supports JPG, PNG, and WebP (Up to 50MB) • Processed 100% locally
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Quality slider */}
              <div className="flex-1 min-w-[200px] space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-stone-800">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Compression Quality
                  </span>
                  <span className="font-mono bg-stone-100 px-2 py-0.5 rounded text-stone-900 border border-stone-200">
                    {quality}%
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={95}
                  step={1}
                  value={quality}
                  onChange={(e) => handleQualityChange(Number(e.target.value))}
                  className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900"
                />
              </div>

              {/* Format selection */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-stone-600">Output:</span>
                <select
                  value={outputFormat}
                  onChange={(e) => handleFormatChange(e.target.value as 'image/jpeg' | 'image/webp' | 'image/png')}
                  className="px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs font-medium bg-stone-50 focus:outline-none"
                >
                  <option value="image/jpeg">JPG / JPEG</option>
                  <option value="image/webp">WebP (Smallest)</option>
                  <option value="image/png">PNG (Lossless)</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={!compressedBlob || isCompressing}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 active:scale-95 text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer disabled:opacity-40"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Compressed</span>
                </button>

                <button
                  type="button"
                  onClick={handleClear}
                  className="p-2 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                  title="Remove image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Savings summary banner */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-stone-500">Original:</span>{' '}
                  <span className="font-semibold text-stone-800">{formatBytes(originalSize)}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                <div>
                  <span className="text-stone-500">Compressed:</span>{' '}
                  <span className="font-semibold text-stone-900">
                    {compressedBlob ? formatBytes(compressedBlob.size) : 'Calculating...'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {percentReduction > 0 ? (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                    {percentReduction}% Saved
                  </span>
                ) : (
                  <span className="text-stone-500">Quality prioritized</span>
                )}
                {originalDimensions && (
                  <span className="text-stone-400 font-mono text-[11px]">
                    {originalDimensions.w} × {originalDimensions.h}px
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Before & After Visual Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original Preview */}
            <div className="bg-white rounded-xl border border-stone-200 p-4 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
                <span>Original Image</span>
                <span className="text-stone-400">{formatBytes(originalSize)}</span>
              </div>
              <div className="aspect-video bg-stone-100 rounded-lg overflow-hidden flex items-center justify-center border border-stone-200">
                {originalUrl && (
                  <img
                    src={originalUrl}
                    alt="Original Upload"
                    className="max-h-full max-w-full object-contain"
                  />
                )}
              </div>
            </div>

            {/* Compressed Preview */}
            <div className="bg-white rounded-xl border border-stone-200 p-4 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
                <span>Compressed Preview</span>
                <span className="text-emerald-700 font-semibold">
                  {compressedBlob ? formatBytes(compressedBlob.size) : '...'}
                </span>
              </div>
              <div className="aspect-video bg-stone-100 rounded-lg overflow-hidden flex items-center justify-center border border-stone-200 relative">
                {isCompressing && (
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center gap-2 text-xs font-medium text-stone-800 z-10">
                    <RefreshCw className="w-4 h-4 animate-spin text-stone-600" />
                    <span>Compressing...</span>
                  </div>
                )}
                {compressedUrl && (
                  <img
                    src={compressedUrl}
                    alt="Compressed Preview"
                    className="max-h-full max-w-full object-contain"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
