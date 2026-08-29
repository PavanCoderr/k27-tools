/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { ToolLayout } from './components/ToolLayout';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { PrivacyPolicyPage, TermsPage, AboutPage, ContactPage } from './pages/StaticPages';
import { NotFoundPage } from './pages/StaticPages';

// Data & SEO
import { getToolBySlug, CATEGORIES } from './data/tools';
import { updatePageSeo, updateSEO } from './utils/seo';
import { ToolCategory } from './types';

// JSON Tools
import { JsonFormatter } from './tools/json/JsonFormatter';
import { JsonValidator } from './tools/json/JsonValidator';
import { JsonToCsv } from './tools/json/JsonToCsv';

// Image Tools
import { ImageCompressor } from './tools/image/ImageCompressor';
import { ImageResizer } from './tools/image/ImageResizer';
import { JpgToPng } from './tools/image/JpgToPng';
import { PngToJpg } from './tools/image/PngToJpg';
import { ImageToWebp } from './tools/image/ImageToWebp';

// Text Tools
import { WordCounter } from './tools/text/WordCounter';
import { CharacterCounter } from './tools/text/CharacterCounter';
import { CaseConverter } from './tools/text/CaseConverter';
import { TextFormatter } from './tools/text/TextFormatter';

// Developer Tools
import { Base64Tool } from './tools/developer/Base64Tool';
import { UrlEncoderTool } from './tools/developer/UrlEncoderTool';
import { UuidGenerator } from './tools/developer/UuidGenerator';
import { JwtDecoderTool } from './tools/developer/JwtDecoderTool';
import { HashGeneratorTool } from './tools/developer/HashGeneratorTool';

// PDF tools and their dependencies load only when a PDF route is opened.
const PdfMergeTool = lazy(() => import('./tools/pdf/PdfMergeTool').then((module) => ({ default: module.PdfMergeTool })));
const PdfSplitTool = lazy(() => import('./tools/pdf/PdfSplitTool').then((module) => ({ default: module.PdfSplitTool })));
const PdfCompressorTool = lazy(() => import('./tools/pdf/PdfCompressorTool').then((module) => ({ default: module.PdfCompressorTool })));

// QR Tools
import { QrGeneratorTool } from './tools/qr/QrGeneratorTool';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Sync browser back / forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Handle in-app navigation
  const navigate = (path: string) => {
    if (path === currentPath) return;
    window.history.pushState({}, '', path);
    setCurrentPath(path.split('#')[0] || '/');
    if (path.includes('#')) {
      requestAnimationFrame(() => {
        document.getElementById(path.split('#')[1])?.scrollIntoView({ behavior: 'smooth' });
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Update SEO Meta Tags and JSON-LD when path changes
  useEffect(() => {
    const cleanPath = currentPath.replace(/\/$/, '') || '/';

    if (cleanPath === '/') {
      updateSEO(); // Default homepage SEO
    } else if (cleanPath.startsWith('/tools/')) {
      const slug = cleanPath.replace('/tools/', '');
      const tool = getToolBySlug(slug);
      if (tool) {
        updateSEO(tool);
      }
    } else if (cleanPath.startsWith('/category/')) {
      const catId = cleanPath.replace('/category/', '') as ToolCategory;
      const cat = CATEGORIES.find((c) => c.id === catId);
      if (cat) {
        updatePageSeo({
          title: `${cat.name} Online Tools - Free & Client-Side | K27 Tools`,
          canonicalPath: `/category/${cat.id}`,
          description: cat.description,
        });
      }
    } else if (cleanPath === '/privacy') {
      updatePageSeo({ title: 'Privacy Policy - 100% Client-Side Processing | K27 Tools', canonicalPath: '/privacy' });
    } else if (cleanPath === '/terms') {
      updatePageSeo({ title: 'Terms of Service | K27 Tools', canonicalPath: '/terms' });
    } else if (cleanPath === '/about') {
      updatePageSeo({ title: 'About Us - Fast, Private Free Utilities | K27 Tools', canonicalPath: '/about' });
    } else if (cleanPath === '/contact') {
      updatePageSeo({ title: 'Contact Us & Request Tools | K27 Tools', canonicalPath: '/contact' });
    } else {
      updatePageSeo({
        title: 'Page Not Found | K27 Tools',
        canonicalPath: cleanPath,
        robots: 'noindex, nofollow',
      });
    }
  }, [currentPath]);

  // Tool component renderer by slug
  const renderToolComponent = (slug: string) => {
    switch (slug) {
      case 'json-formatter':
        return <JsonFormatter />;
      case 'json-validator':
        return <JsonValidator />;
      case 'json-to-csv':
        return <JsonToCsv />;
      case 'image-compressor':
        return <ImageCompressor />;
      case 'image-resizer':
        return <ImageResizer />;
      case 'jpg-to-png':
        return <JpgToPng />;
      case 'png-to-jpg':
        return <PngToJpg />;
      case 'jpg-png-to-webp':
        return <ImageToWebp />;
      case 'word-counter':
        return <WordCounter />;
      case 'character-counter':
        return <CharacterCounter />;
      case 'case-converter':
        return <CaseConverter />;
      case 'text-formatter':
        return <TextFormatter />;
      case 'base64':
        return <Base64Tool />;
      case 'url-encoder':
        return <UrlEncoderTool />;
      case 'uuid-generator':
        return <UuidGenerator />;
      case 'jwt-decoder':
        return <JwtDecoderTool />;
      case 'hash-generator':
        return <HashGeneratorTool />;
      case 'pdf-merge':
        return <PdfMergeTool />;
      case 'pdf-split':
        return <PdfSplitTool />;
      case 'pdf-compressor':
        return <PdfCompressorTool />;
      case 'qr-generator':
        return <QrGeneratorTool />;
      default:
        return null;
    }
  };

  // Route Dispatcher
  const renderContent = () => {
    const cleanPath = currentPath.replace(/\/$/, '') || '/';

    // Tool Page: /tools/:slug
    if (cleanPath.startsWith('/tools/')) {
      const slug = cleanPath.replace('/tools/', '');
      const tool = getToolBySlug(slug);

      if (tool) {
        const toolComponent = renderToolComponent(tool.slug);
        return (
          <ToolLayout tool={tool} onNavigate={navigate}>
            <Suspense fallback={<div className="rounded-xl border border-stone-200 bg-white p-6 text-sm text-stone-500">Loading PDF tools...</div>}>
              {toolComponent}
            </Suspense>
          </ToolLayout>
        );
      }
    }

    // Category Page: /category/:category
    if (cleanPath.startsWith('/category/')) {
      const catId = cleanPath.replace('/category/', '') as ToolCategory;
      if (!CATEGORIES.some((category) => category.id === catId)) {
        return <NotFoundPage onNavigate={navigate} />;
      }
      return <CategoryPage category={catId} onNavigate={navigate} />;
    }

    // Static Pages
    if (cleanPath === '/privacy') {
      return <PrivacyPolicyPage onNavigate={navigate} />;
    }
    if (cleanPath === '/terms') {
      return <TermsPage onNavigate={navigate} />;
    }
    if (cleanPath === '/about') {
      return <AboutPage onNavigate={navigate} />;
    }
    if (cleanPath === '/contact') {
      return <ContactPage onNavigate={navigate} />;
    }

    if (cleanPath !== '/') {
      return <NotFoundPage onNavigate={navigate} />;
    }

    // Default: Home Page
    return <HomePage onNavigate={navigate} onOpenSearch={() => setIsSearchOpen(true)} />;
  };

  return (
    <div id="k27-app-root" className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans antialiased selection:bg-stone-900 selection:text-white">
      {/* Header Bar */}
      <Header currentPath={currentPath} onNavigate={navigate} onOpenSearch={() => setIsSearchOpen(true)} />

      {/* Main View Area */}
      <main className="flex-1">
        {renderContent()}
      </main>

      {/* Footer */}
      <Footer onNavigate={navigate} />

      {/* Quick Search Modal (Command/Ctrl + K) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onOpen={() => setIsSearchOpen(true)}
        onNavigate={navigate}
      />
    </div>
  );
}
