import React from 'react';
import { SITE_CONFIG, CATEGORIES_CONFIG } from '../config/site';
import { TOOLS } from '../data/tools';
import { ShieldCheck, Heart, Github } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer id="main-footer" className="bg-white border-t border-stone-200 mt-20 pt-16 pb-12 text-stone-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 pb-12 border-b border-stone-200">
          
          {/* Brand Column */}
          <div className="col-span-2 space-y-4">
            <button
              type="button"
              id="footer-brand-btn"
              onClick={() => onNavigate('/')}
              className="flex items-center gap-2.5 text-left cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center font-bold text-sm">
                K27
              </div>
              <span className="text-base font-bold text-stone-900">
                {SITE_CONFIG.siteName}
              </span>
            </button>
            
            <p className="text-xs text-stone-500 leading-relaxed max-w-sm">
              Free, fast, and privacy-first online tools for developers, designers, students, and writers.
              All operations run 100% client-side in your web browser. No data is stored or transmitted.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Zero-Server Processing Guarantee</span>
            </div>
          </div>

          {/* Column 1: JSON & Developer Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
              Developer Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/tools/json-formatter')}
                  className="hover:text-stone-900 transition-colors"
                >
                  JSON Formatter
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/tools/json-validator')}
                  className="hover:text-stone-900 transition-colors"
                >
                  JSON Validator
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/tools/base64')}
                  className="hover:text-stone-900 transition-colors"
                >
                  Base64 Encode/Decode
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/tools/jwt-decoder')}
                  className="hover:text-stone-900 transition-colors"
                >
                  JWT Decoder
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/tools/uuid-generator')}
                  className="hover:text-stone-900 transition-colors"
                >
                  UUID Generator
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/tools/hash-generator')}
                  className="hover:text-stone-900 transition-colors"
                >
                  Hash Generator
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Image Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
              Image Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/tools/image-compressor')}
                  className="hover:text-stone-900 transition-colors"
                >
                  Image Compressor
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/tools/image-resizer')}
                  className="hover:text-stone-900 transition-colors"
                >
                  Image Resizer
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/tools/jpg-png-to-webp')}
                  className="hover:text-stone-900 transition-colors"
                >
                  Convert to WebP
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/tools/jpg-to-png')}
                  className="hover:text-stone-900 transition-colors"
                >
                  JPG to PNG
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/tools/png-to-jpg')}
                  className="hover:text-stone-900 transition-colors"
                >
                  PNG to JPG
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Text & PDF & QR */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
              Text & PDF Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/tools/word-counter')}
                  className="hover:text-stone-900 transition-colors"
                >
                  Word Counter
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/tools/case-converter')}
                  className="hover:text-stone-900 transition-colors"
                >
                  Case Converter
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/tools/pdf-merge')}
                  className="hover:text-stone-900 transition-colors"
                >
                  PDF Merge
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/tools/pdf-split')}
                  className="hover:text-stone-900 transition-colors"
                >
                  PDF Split
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/tools/qr-generator')}
                  className="hover:text-stone-900 transition-colors"
                >
                  QR Code Generator
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Company & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
              Platform & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/about')}
                  className="hover:text-stone-900 transition-colors"
                >
                  About K27 Tools
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/privacy')}
                  className="hover:text-stone-900 transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/terms')}
                  className="hover:text-stone-900 transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-stone-900 transition-colors"
                >
                  Contact & Support
                </button>
              </li>
              <li>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-stone-900 transition-colors"
                >
                  Sitemap.xml
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} {SITE_CONFIG.siteName}. All rights reserved. $0 budget friendly open utilities.
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('/privacy')}
              className="hover:text-stone-900 transition-colors"
            >
              Privacy Policy
            </button>
            <span className="text-stone-300">•</span>
            <button
              type="button"
              onClick={() => onNavigate('/terms')}
              className="hover:text-stone-900 transition-colors"
            >
              Terms of Service
            </button>
            <span className="text-stone-300">•</span>
            <button
              type="button"
              onClick={() => onNavigate('/contact')}
              className="hover:text-stone-900 transition-colors"
            >
              Contact
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
