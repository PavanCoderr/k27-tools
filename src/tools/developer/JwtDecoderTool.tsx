import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, Clock, Copy, Check, Trash2, KeyRound } from 'lucide-react';
import { copyToClipboard } from '../../utils/file';

export const JwtDecoderTool: React.FC = () => {
  const sampleToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsZXggS3VtYXIiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTk1MzkwNDYyMn0.4z2u3bS8x98327vL7k38y_Z9u7b_w8492043`;

  const [token, setToken] = useState(sampleToken);
  const [copiedHeader, setCopiedHeader] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);

  // Decode standard Base64Url
  const decodeBase64Url = (base64Url: string) => {
    try {
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) {
        base64 += '=';
      }
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return new TextDecoder().decode(bytes);
    } catch {
      return null;
    }
  };

  const parseJwt = () => {
    if (!token.trim()) return null;
    const parts = token.trim().split('.');
    if (parts.length < 2) {
      return { error: 'Invalid JWT format. Must contain at least header.payload separated by dots.' };
    }

    const headerRaw = decodeBase64Url(parts[0]);
    const payloadRaw = decodeBase64Url(parts[1]);

    if (!headerRaw || !payloadRaw) {
      return { error: 'Failed to decode Base64Url segments in token.' };
    }

    try {
      const header = JSON.parse(headerRaw);
      const payload = JSON.parse(payloadRaw);

      let expDate: Date | null = null;
      let iatDate: Date | null = null;
      let isExpired = false;

      if (payload.exp) {
        expDate = new Date(payload.exp * 1000);
        isExpired = expDate.getTime() < Date.now();
      }

      if (payload.iat) {
        iatDate = new Date(payload.iat * 1000);
      }

      return {
        header,
        payload,
        signature: parts[2] || '',
        expDate,
        iatDate,
        isExpired,
        rawHeader: JSON.stringify(header, null, 2),
        rawPayload: JSON.stringify(payload, null, 2),
      };
    } catch {
      return { error: 'Decoded header or payload is not valid JSON.' };
    }
  };

  const parsed = parseJwt();

  const handleCopyHeader = async () => {
    if (!parsed || !parsed.rawHeader) return;
    const ok = await copyToClipboard(parsed.rawHeader);
    if (ok) {
      setCopiedHeader(true);
      setTimeout(() => setCopiedHeader(false), 2000);
    }
  };

  const handleCopyPayload = async () => {
    if (!parsed || !parsed.rawPayload) return;
    const ok = await copyToClipboard(parsed.rawPayload);
    if (ok) {
      setCopiedPayload(true);
      setTimeout(() => setCopiedPayload(false), 2000);
    }
  };

  return (
    <div id="jwt-decoder-component" className="space-y-6">
      {/* Security Disclaimer Banner */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-bold text-amber-900">Security & Privacy Notice</div>
          <p className="text-amber-800 leading-relaxed">
            All JWT inspection is done 100% in your local browser memory. 
            <strong> Note:</strong> Decoding an encoded JWT payload reveals its claims, but does <strong>NOT</strong> verify its cryptographic signature against your server secret.
          </p>
        </div>
      </div>

      {/* Input Field */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-2.5 bg-stone-50/80 border-b border-stone-200 flex items-center justify-between text-xs text-stone-600 font-medium">
          <div className="flex items-center gap-2">
            <KeyRound className="w-3.5 h-3.5 text-stone-500" />
            <span>Encoded JWT Token</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setToken(sampleToken)}
              className="text-xs text-stone-600 hover:text-stone-900 underline font-medium cursor-pointer"
            >
              Load Sample Token
            </button>

            <button
              type="button"
              onClick={() => setToken('')}
              className="p-1 text-stone-400 hover:text-rose-600 rounded hover:bg-stone-100 cursor-pointer"
              title="Clear"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <textarea
          id="jwt-input-textarea"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste your JSON Web Token (e.g. eyJhbGci...)..."
          rows={4}
          className="w-full p-4 font-mono text-xs text-stone-800 bg-white focus:outline-none resize-y placeholder:text-stone-400 leading-relaxed break-all"
          spellCheck={false}
        />
      </div>

      {/* Token Analysis / Claims Status */}
      {parsed && !parsed.error && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 bg-white rounded-xl border border-stone-200 shadow-2xs flex items-center gap-3">
            <Clock className="w-4 h-4 text-stone-500" />
            <div className="text-xs">
              <div className="text-stone-400 font-medium">Algorithm (alg)</div>
              <div className="font-mono font-bold text-stone-900">
                {parsed.header?.alg || 'None'}
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-stone-200 shadow-2xs flex items-center gap-3">
            <Clock className="w-4 h-4 text-stone-500" />
            <div className="text-xs">
              <div className="text-stone-400 font-medium">Issued At (iat)</div>
              <div className="font-mono font-bold text-stone-900">
                {parsed.iatDate ? parsed.iatDate.toLocaleString() : 'Not present'}
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-stone-200 shadow-2xs flex items-center gap-3">
            <div className="text-xs">
              <div className="text-stone-400 font-medium">Expiration Status (exp)</div>
              <div className="flex items-center gap-1.5 font-bold">
                {parsed.expDate ? (
                  parsed.isExpired ? (
                    <span className="text-rose-600">Expired ({parsed.expDate.toLocaleDateString()})</span>
                  ) : (
                    <span className="text-emerald-600">Active ({parsed.expDate.toLocaleDateString()})</span>
                  )
                ) : (
                  <span className="text-stone-600">Never expires (No exp claim)</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error state */}
      {parsed && parsed.error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
          {parsed.error}
        </div>
      )}

      {/* Decoded Sections */}
      {parsed && !parsed.error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Decoded Header */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden flex flex-col">
            <div className="px-4 py-2.5 bg-rose-50/70 border-b border-rose-100 flex items-center justify-between text-xs text-rose-900 font-medium">
              <span>Header: Algorithm & Token Type</span>
              <button
                type="button"
                onClick={handleCopyHeader}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white hover:bg-rose-100 border border-rose-200 text-rose-800 text-[11px] cursor-pointer"
              >
                {copiedHeader ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedHeader ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-4 font-mono text-xs text-stone-800 bg-stone-50/30 overflow-x-auto leading-relaxed">
              {parsed.rawHeader}
            </pre>
          </div>

          {/* Decoded Payload */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden flex flex-col">
            <div className="px-4 py-2.5 bg-purple-50/70 border-b border-purple-100 flex items-center justify-between text-xs text-purple-900 font-medium">
              <span>Payload: Data Claims</span>
              <button
                type="button"
                onClick={handleCopyPayload}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white hover:bg-purple-100 border border-purple-200 text-purple-800 text-[11px] cursor-pointer"
              >
                {copiedPayload ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedPayload ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-4 font-mono text-xs text-stone-800 bg-stone-50/30 overflow-x-auto leading-relaxed">
              {parsed.rawPayload}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
