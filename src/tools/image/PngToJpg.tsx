import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, ImageMinus, Trash2, Palette, Sparkles } from 'lucide-react';
import { formatBytes, downloadFile } from '../../utils/file';

export const PngToJpg: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');
  const [quality, setQuality] = useState<number>(90);
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (uploadedFile: File) => {
    setFile(uploadedFile);
    const url = URL.createObjectURL(uploadedFile);
    setImageSrc(url);

    const img = new Image();
    img.onload = () => {
      renderJpg(img, bgColor, quality);
    };
    img.src = url;
  };

  const renderJpg = (img: HTMLImageElement, background: string, qPercent: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Fill solid background for transparent PNG areas
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            if (convertedUrl) URL.revokeObjectURL(convertedUrl);
            const newUrl = URL.createObjectURL(blob);
            setConvertedBlob(blob);
            setConvertedUrl(newUrl);
          }
        },
        'image/jpeg',
        qPercent / 100
      );
    }
  };

  const updateConversion = (newBg = bgColor, newQ = quality) => {
    if (!imageSrc) return;
    const img = new Image();
    img.onload = () => renderJpg(img, newBg, newQ);
    img.src = imageSrc;
  };

  const handleDownload = () => {
    if (!convertedBlob || !file) return;
    const name = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    downloadFile(convertedBlob, `${name}.jpg`, 'image/jpeg');
  };

  const handleClear = () => {
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    if (convertedUrl) URL.revokeObjectURL(convertedUrl);
    setFile(null);
    setImageSrc(null);
    setConvertedBlob(null);
    setConvertedUrl(null);
  };

  useEffect(() => () => {
    if (imageSrc) URL.revokeObjectURL(imageSrc);
  }, [imageSrc]);

  useEffect(() => () => {
    if (convertedUrl) URL.revokeObjectURL(convertedUrl);
  }, [convertedUrl]);

  return (
    <div id="png-to-jpg-component" className="space-y-6">
      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files[0];
            if (f) handleFile(f);
          }}
          className="border-2 border-dashed border-stone-300 hover:border-stone-500 bg-white rounded-2xl p-12 text-center transition-all cursor-pointer group flex flex-col items-center justify-center gap-3"
        >
          <div className="w-14 h-14 rounded-2xl bg-stone-100 group-hover:bg-stone-900 group-hover:text-white flex items-center justify-center text-stone-700 transition-colors shadow-2xs">
            <ImageMinus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-stone-900">
              Upload PNG image to convert to JPG
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Custom background fill for transparent pixels • Quality slider
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Background Color Picker for Alpha */}
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-stone-600" />
                <span className="text-xs font-semibold text-stone-700">Fill Transparency:</span>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => {
                    setBgColor(e.target.value);
                    updateConversion(e.target.value, quality);
                  }}
                  className="w-7 h-7 rounded border border-stone-300 cursor-pointer p-0.5"
                  title="Choose background color"
                />
                <span className="text-xs font-mono text-stone-500">{bgColor}</span>
              </div>

              {/* Quality slider */}
              <div className="flex items-center gap-3 min-w-[200px]">
                <span className="text-xs font-medium text-stone-600">Quality:</span>
                <input
                  type="range"
                  min={20}
                  max={100}
                  value={quality}
                  onChange={(e) => {
                    const q = Number(e.target.value);
                    setQuality(q);
                    updateConversion(bgColor, q);
                  }}
                  className="flex-1 h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900"
                />
                <span className="text-xs font-mono font-medium text-stone-800">{quality}%</span>
              </div>

              {/* Download Action */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={!convertedBlob}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 active:scale-95 text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer disabled:opacity-40"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .JPG ({convertedBlob ? formatBytes(convertedBlob.size) : '...'})</span>
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

            <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
              <span>Original PNG: {formatBytes(file.size)}</span>
              <span>
                JPG Result: {convertedBlob ? formatBytes(convertedBlob.size) : '...'}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 p-4 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
              <span>Converted JPG Preview</span>
            </div>
            <div className="aspect-video bg-stone-100 rounded-lg overflow-hidden flex items-center justify-center border border-stone-200 p-2">
              {convertedUrl && (
                <img
                  src={convertedUrl}
                  alt="Converted JPG"
                  className="max-h-full max-w-full object-contain"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
