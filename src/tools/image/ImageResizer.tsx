import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, Scaling, Lock, Unlock, Trash2, ArrowRight, Check } from 'lucide-react';
import { formatBytes, downloadFile } from '../../utils/file';
import { validateImageDimensions, validateImageFile } from '../../utils/transform';

export const ImageResizer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalWidth, setOriginalWidth] = useState<number>(0);
  const [originalHeight, setOriginalHeight] = useState<number>(0);

  const [targetWidth, setTargetWidth] = useState<number>(0);
  const [targetHeight, setTargetHeight] = useState<number>(0);
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(true);
  const [format, setFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');
  const [quality, setQuality] = useState<number>(90);

  const [resizedBlob, setResizedBlob] = useState<Blob | null>(null);
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const presets = [
    { label: 'Full HD (1920 × 1080)', w: 1920, h: 1080 },
    { label: 'Standard HD (1280 × 720)', w: 1280, h: 720 },
    { label: 'Instagram Square (1080 × 1080)', w: 1080, h: 1080 },
    { label: 'Avatar / Profile (400 × 400)', w: 400, h: 400 },
    { label: 'Medium Web (800 × 600)', w: 800, h: 600 },
  ];

  const handleFile = (uploadedFile: File) => {
    const fileError = validateImageFile(uploadedFile);
    if (fileError) {
      alert(fileError);
      return;
    }

    setFile(uploadedFile);
    const url = URL.createObjectURL(uploadedFile);
    setImageSrc(url);

    const img = new Image();
    img.onload = () => {
      if (validateImageDimensions(img.width, img.height)) {
        URL.revokeObjectURL(url);
        alert('Images larger than 40 megapixels are not supported.');
        return;
      }
      setOriginalWidth(img.width);
      setOriginalHeight(img.height);
      setTargetWidth(img.width);
      setTargetHeight(img.height);
      renderResized(img, img.width, img.height, format, quality);
    };
    img.src = url;
  };

  const handleWidthChange = (w: number) => {
    if (!Number.isFinite(w) || w < 1 || w > 10000) return;
    setTargetWidth(w);
    if (lockAspectRatio && originalWidth > 0) {
      const ratio = originalHeight / originalWidth;
      setTargetHeight(Math.round(w * ratio));
    }
  };

  const handleHeightChange = (h: number) => {
    if (!Number.isFinite(h) || h < 1 || h > 10000) return;
    setTargetHeight(h);
    if (lockAspectRatio && originalHeight > 0) {
      const ratio = originalWidth / originalHeight;
      setTargetWidth(Math.round(h * ratio));
    }
  };

  const applyPreset = (w: number, h: number) => {
    setTargetWidth(w);
    setTargetHeight(h);
    if (imageSrc) {
      const img = new Image();
      img.onload = () => renderResized(img, w, h, format, quality);
      img.src = imageSrc;
    }
  };

  const renderResized = (
    img: HTMLImageElement,
    w: number,
    h: number,
    fmt: string,
    q: number
  ) => {
    if (w <= 0 || h <= 0 || w > 10000 || h > 10000 || w * h > 40_000_000) {
      setIsProcessing(false);
      return;
    }
    setIsProcessing(true);

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setIsProcessing(false);
      return;
    }

    // High quality bicubic scaling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    if (fmt === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, w, h);
    }

    ctx.drawImage(img, 0, 0, w, h);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          if (resizedUrl) URL.revokeObjectURL(resizedUrl);
          const newUrl = URL.createObjectURL(blob);
          setResizedBlob(blob);
          setResizedUrl(newUrl);
        }
        setIsProcessing(false);
      },
      fmt,
      q / 100
    );
  };

  const triggerResize = () => {
    if (!imageSrc) return;
    const img = new Image();
    img.onload = () => renderResized(img, targetWidth, targetHeight, format, quality);
    img.src = imageSrc;
  };

  const handleDownload = () => {
    if (!resizedBlob || !file) return;
    const ext = format === 'image/jpeg' ? 'jpg' : format === 'image/webp' ? 'webp' : 'png';
    const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    downloadFile(resizedBlob, `${nameWithoutExt}-${targetWidth}x${targetHeight}.${ext}`, format);
  };

  const handleClear = () => {
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    if (resizedUrl) URL.revokeObjectURL(resizedUrl);
    setFile(null);
    setImageSrc(null);
    setResizedBlob(null);
    setResizedUrl(null);
    setOriginalWidth(0);
    setOriginalHeight(0);
  };

  useEffect(() => () => {
    if (imageSrc) URL.revokeObjectURL(imageSrc);
  }, [imageSrc]);

  useEffect(() => () => {
    if (resizedUrl) URL.revokeObjectURL(resizedUrl);
  }, [resizedUrl]);

  return (
    <div id="image-resizer-component" className="space-y-6">
      {!file ? (
        <div
          id="resizer-dropzone"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const dropped = e.dataTransfer.files[0];
            if (dropped) handleFile(dropped);
          }}
          className="border-2 border-dashed border-stone-300 hover:border-stone-500 bg-white rounded-2xl p-12 text-center transition-all cursor-pointer group flex flex-col items-center justify-center gap-3"
        >
          <div className="w-14 h-14 rounded-2xl bg-stone-100 group-hover:bg-stone-900 group-hover:text-white flex items-center justify-center text-stone-700 transition-colors shadow-2xs">
            <Scaling className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-stone-900">
              Click to upload or drag & drop image to resize
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Supports JPG, PNG, and WebP • Custom width, height, & presets
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Controls Card */}
          <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-100">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                  Target Dimensions
                </h3>
                <p className="text-xs text-stone-600">
                  Original: {originalWidth} × {originalHeight}px ({formatBytes(file.size)})
                </p>
              </div>

              <button
                type="button"
                onClick={handleClear}
                className="p-2 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                title="Remove image"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Dimension Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Width (px)
                </label>
                <input
                  type="number"
                  value={targetWidth || ''}
                  onChange={(e) => handleWidthChange(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-mono font-medium focus:ring-1 focus:ring-stone-900 focus:outline-none"
                />
              </div>

              <div className="flex justify-center pt-5">
                <button
                  type="button"
                  onClick={() => setLockAspectRatio(!lockAspectRatio)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                    lockAspectRatio
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'
                  }`}
                >
                  {lockAspectRatio ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  <span>{lockAspectRatio ? 'Locked Ratio' : 'Unlocked'}</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Height (px)
                </label>
                <input
                  type="number"
                  value={targetHeight || ''}
                  onChange={(e) => handleHeightChange(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-mono font-medium focus:ring-1 focus:ring-stone-900 focus:outline-none"
                />
              </div>
            </div>

            {/* Preset Buttons */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-medium text-stone-500">Popular Presets:</span>
              <div className="flex flex-wrap gap-2">
                {presets.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => applyPreset(p.w, p.h)}
                    className="px-2.5 py-1 rounded-md bg-stone-100 hover:bg-stone-200 text-[11px] font-medium text-stone-700 transition-colors cursor-pointer"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Format & Quality & Action */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-100">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-stone-600">Export:</span>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as 'image/jpeg' | 'image/png' | 'image/webp')}
                    className="px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs font-medium bg-stone-50"
                  >
                    <option value="image/jpeg">JPG</option>
                    <option value="image/png">PNG</option>
                    <option value="image/webp">WebP</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={triggerResize}
                  className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-xs font-medium text-stone-800 cursor-pointer"
                >
                  Apply Resize
                </button>
              </div>

              <button
                type="button"
                onClick={handleDownload}
                disabled={!resizedBlob || isProcessing}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 active:scale-95 text-white text-xs font-semibold transition-all cursor-pointer disabled:opacity-40"
              >
                <Download className="w-4 h-4" />
                <span>Download Resized Image</span>
              </button>
            </div>
          </div>

          {/* Preview Canvas */}
          <div className="bg-white rounded-xl border border-stone-200 p-4 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
              <span>Resized Preview ({targetWidth} × {targetHeight}px)</span>
              <span className="text-stone-400">
                {resizedBlob ? formatBytes(resizedBlob.size) : 'Rendering...'}
              </span>
            </div>
            <div className="min-h-[220px] max-h-[400px] bg-stone-100 rounded-lg overflow-auto flex items-center justify-center p-4 border border-stone-200">
              {resizedUrl && (
                <img
                  src={resizedUrl}
                  alt="Resized Result"
                  className="max-h-[360px] object-contain shadow-xs"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
