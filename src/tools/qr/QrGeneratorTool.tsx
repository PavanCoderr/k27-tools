import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  QrCode, 
  Download, 
  Copy, 
  Check, 
  Wifi, 
  Globe, 
  Mail, 
  Phone, 
  Palette, 
  Sparkles,
  Settings2,
  Trash2
} from 'lucide-react';
import { copyToClipboard, downloadFile } from '../../utils/file';
import { escapeWifiValue } from '../../utils/transform';
import { SITE_CONFIG } from '../../config/site';

export const QrGeneratorTool: React.FC = () => {
  const [contentType, setContentType] = useState<'url' | 'wifi' | 'email' | 'phone'>('url');
  
  // Content states
  const [rawText, setRawText] = useState(SITE_CONFIG.siteUrl);
  const [wifiSsid, setWifiSsid] = useState('MyHomeNetwork');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiEncryption, setWifiEncryption] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [wifiHidden, setWifiHidden] = useState(false);

  const [emailTo, setEmailTo] = useState('contact@example.com');
  const [emailSubject, setEmailSubject] = useState('Hello from K27 Tools');
  const [emailBody, setEmailBody] = useState('');

  const [phoneNumber, setPhoneNumber] = useState('+1234567890');

  // Customization states
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [size, setSize] = useState(320);
  const [errorCorrection, setErrorCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('M');

  // Generated QR output
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const generationId = useRef(0);

  const getPayload = (): string => {
    switch (contentType) {
      case 'url':
        return rawText.trim();
      case 'wifi':
        return `WIFI:T:${wifiEncryption};S:${escapeWifiValue(wifiSsid)};P:${escapeWifiValue(wifiPassword)};H:${wifiHidden ? 'true' : 'false'};;`;
      case 'email':
        return `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      case 'phone':
        return `tel:${phoneNumber.replace(/\s+/g, '')}`;
      default:
        return rawText;
    }
  };

  const generateQr = async () => {
    const currentId = ++generationId.current;
    const payload = getPayload();
    if (!payload) {
      setQrDataUrl('');
      canvasRef.current?.getContext('2d')?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      return;
    }

    try {
      const url = await QRCode.toDataURL(payload, {
        width: size,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: errorCorrection,
      });
      if (currentId !== generationId.current) return;
      setQrDataUrl(url);

      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, payload, {
          width: size,
          margin: 2,
          color: {
            dark: fgColor,
            light: bgColor,
          },
          errorCorrectionLevel: errorCorrection,
        });
        if (currentId !== generationId.current) return;
      }
    } catch (err) {
      console.error('QR Generation failed:', err);
    }
  };

  useEffect(() => {
    generateQr();
  }, [
    contentType,
    rawText,
    wifiSsid,
    wifiPassword,
    wifiEncryption,
    wifiHidden,
    emailTo,
    emailSubject,
    emailBody,
    phoneNumber,
    fgColor,
    bgColor,
    size,
    errorCorrection,
  ]);

  const handleDownloadPng = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `k27_qr_code_${size}px.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadSvg = async () => {
    const payload = getPayload();
    try {
      const svgString = await QRCode.toString(payload, {
        type: 'svg',
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: errorCorrection,
      });
      downloadFile(svgString, 'k27_qr_code.svg', 'image/svg+xml');
    } catch (err) {
      console.error('SVG download failed', err);
    }
  };

  const handleCopyImage = async () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob(async (blob) => {
      if (!blob) return;
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Fallback copy text payload
        await copyToClipboard(getPayload());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    });
  };

  return (
    <div id="qr-generator-component" className="space-y-6">
      {/* Content Type Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          type="button"
          onClick={() => setContentType('url')}
          className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
            contentType === 'url'
              ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>URL / Text</span>
        </button>

        <button
          type="button"
          onClick={() => setContentType('wifi')}
          className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
            contentType === 'wifi'
              ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Wifi className="w-4 h-4" />
          <span>Wi-Fi Network</span>
        </button>

        <button
          type="button"
          onClick={() => setContentType('email')}
          className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
            contentType === 'email'
              ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Email Compose</span>
        </button>

        <button
          type="button"
          onClick={() => setContentType('phone')}
          className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
            contentType === 'phone'
              ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>Phone Call</span>
        </button>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form Settings Column */}
        <div className="lg:col-span-7 space-y-5">
          {/* Content Inputs Card */}
          <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
              Content Details
            </h3>

            {/* URL/Text mode */}
            {contentType === 'url' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-stone-700">
                  Website URL or Plain Text
                </label>
                <textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="https://yourwebsite.com or any message..."
                  rows={4}
                  className="w-full p-3 rounded-lg border border-stone-300 text-xs font-mono focus:ring-1 focus:ring-stone-900 focus:outline-none"
                />
              </div>
            )}

            {/* Wi-Fi mode */}
            {contentType === 'wifi' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Network Name (SSID)
                  </label>
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    placeholder="e.g. CoffeeShop_Guest"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs focus:ring-1 focus:ring-stone-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Password
                  </label>
                  <input
                    type="text"
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                    placeholder="Wireless password (or empty for open)"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs focus:ring-1 focus:ring-stone-900 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Security Type
                    </label>
                    <select
                      value={wifiEncryption}
                      onChange={(e) => setWifiEncryption(e.target.value as 'WPA' | 'WEP' | 'nopass')}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs bg-stone-50"
                    >
                      <option value="WPA">WPA / WPA2 / WPA3</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">None (Open Network)</option>
                    </select>
                  </div>

                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 text-xs text-stone-700 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={wifiHidden}
                        onChange={(e) => setWifiHidden(e.target.checked)}
                        className="rounded text-stone-900 focus:ring-stone-900"
                      />
                      <span>Hidden SSID</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Email mode */}
            {contentType === 'email' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Recipient Email
                  </label>
                  <input
                    type="email"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    placeholder="support@company.com"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Subject line..."
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Pre-filled Body (Optional)
                  </label>
                  <textarea
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    rows={3}
                    className="w-full p-3 rounded-lg border border-stone-300 text-xs focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Phone mode */}
            {contentType === 'phone' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-stone-700">
                  Telephone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-mono focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Style & Resolution Customizer */}
          <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-stone-600" />
              <span>Design & Quality Options</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Color pickers */}
              <div className="flex items-center gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-stone-600">
                    QR Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-8 h-8 rounded border border-stone-300 cursor-pointer p-0.5"
                    />
                    <span className="font-mono text-xs text-stone-600">{fgColor}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-stone-600">
                    Background
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-8 h-8 rounded border border-stone-300 cursor-pointer p-0.5"
                    />
                    <span className="font-mono text-xs text-stone-600">{bgColor}</span>
                  </div>
                </div>
              </div>

              {/* Error correction level */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  Error Correction Level
                </label>
                <select
                  value={errorCorrection}
                  onChange={(e) => setErrorCorrection(e.target.value as 'L' | 'M' | 'Q' | 'H')}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-stone-50"
                >
                  <option value="L">Low (7% recovery)</option>
                  <option value="M">Medium (15% recovery)</option>
                  <option value="Q">Quartile (25% recovery)</option>
                  <option value="H">High (30% recovery, best for logos)</option>
                </select>
              </div>
            </div>

            {/* Resolution slider */}
            <div className="pt-2 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-700">Export Dimensions</span>
                <span className="font-mono text-stone-500">{size} × {size}px</span>
              </div>
              <input
                type="range"
                min={200}
                max={1000}
                step={40}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900"
              />
            </div>
          </div>
        </div>

        {/* Right Live Preview & Export Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-2xs flex flex-col items-center justify-center space-y-5 text-center">
            <div className="flex items-center justify-between w-full text-xs font-semibold text-stone-700 pb-3 border-b border-stone-100">
              <span>Live QR Preview</span>
              <span className="text-emerald-600 font-medium">Ready</span>
            </div>

            {/* Canvas Container */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-center max-w-full">
              <canvas
                ref={canvasRef}
                className="max-w-[260px] max-h-[260px] w-auto h-auto rounded-lg shadow-xs"
              />
            </div>

            {/* Actions */}
            <div className="w-full space-y-2 pt-2">
              <button
                type="button"
                id="download-qr-png-btn"
                onClick={handleDownloadPng}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 active:scale-98 text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download High-Res PNG ({size}px)</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleDownloadSvg}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Vector SVG</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyImage}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-stone-500" />
                      <span>Copy Image</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
