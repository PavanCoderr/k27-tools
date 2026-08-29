import React, { useState } from 'react';
import { SITE_CONFIG, CATEGORIES_CONFIG } from '../config/site';
import { 
  Search, 
  Layers, 
  Menu, 
  X, 
  ChevronDown, 
  ShieldCheck, 
  Sparkles,
  Command
} from 'lucide-react';
import { getToolIcon } from '../utils/iconHelper';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate, onOpenSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const handleNav = (path: string) => {
    setMobileMenuOpen(false);
    setCategoriesOpen(false);
    onNavigate(path);
  };

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            id="brand-logo-btn"
            onClick={() => handleNav('/')}
            className="flex items-center gap-2.5 group cursor-pointer text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center font-bold text-sm tracking-tighter group-hover:scale-105 transition-transform shadow-xs">
              K27
            </div>
            <div>
              <div className="text-base font-bold tracking-tight text-stone-900 flex items-center gap-1.5">
                <span>{SITE_CONFIG.siteName}</span>
                <span className="hidden sm:inline-flex text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded bg-stone-100 text-stone-600 border border-stone-200">
                  Free
                </span>
              </div>
              <p className="hidden md:block text-[10px] text-stone-400 font-medium tracking-tight">
                {SITE_CONFIG.tagline}
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-medium text-stone-600">
            <button
              type="button"
              id="nav-all-tools"
              onClick={() => handleNav('/#all-tools')}
              className={`px-3 py-1.5 rounded-lg hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer ${
                currentPath === '/' ? 'text-stone-900 font-semibold' : ''
              }`}
            >
              All Tools
            </button>

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                type="button"
                id="nav-categories-dropdown"
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                onBlur={() => setTimeout(() => setCategoriesOpen(false), 200)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <span>Categories</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} />
              </button>

              {categoriesOpen && (
                <div
                  id="categories-menu-popup"
                  className="absolute left-0 top-full mt-1.5 w-64 bg-white rounded-xl border border-stone-200 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                >
                  <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                    Categories
                  </div>
                  {CATEGORIES_CONFIG.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      id={`dropdown-cat-${cat.id}`}
                      onClick={() => handleNav(`/category/${cat.id}`)}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-xs font-medium text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer"
                    >
                      <div className="w-6 h-6 rounded bg-stone-100 flex items-center justify-center text-stone-700">
                        {getToolIcon(cat.iconName, { className: 'w-3.5 h-3.5' })}
                      </div>
                      <div>
                        <div className="text-stone-900 font-semibold">{cat.name}</div>
                        <div className="text-[10px] text-stone-400 truncate max-w-[170px]">
                          {cat.shortDescription}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              id="nav-about"
              onClick={() => handleNav('/about')}
              className={`px-3 py-1.5 rounded-lg hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer ${
                currentPath === '/about' ? 'text-stone-900 font-semibold bg-stone-100' : ''
              }`}
            >
              About
            </button>

            <button
              type="button"
              id="nav-privacy"
              onClick={() => handleNav('/privacy')}
              className={`px-3 py-1.5 rounded-lg hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer ${
                currentPath === '/privacy' ? 'text-stone-900 font-semibold bg-stone-100' : ''
              }`}
            >
              Privacy
            </button>
          </nav>
        </div>

        {/* Search Trigger and Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Instant Search Bar Trigger */}
          <button
            type="button"
            id="header-search-trigger-btn"
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200/80 border border-stone-200/80 text-stone-500 hover:text-stone-800 text-xs font-medium transition-all cursor-pointer w-36 sm:w-60 justify-between"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Search className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Search tools...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-stone-500 bg-white border border-stone-200 rounded shadow-2xs">
              <Command className="w-2.5 h-2.5" /> K
            </kbd>
          </button>

          {/* Privacy Pill */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-medium border border-emerald-200/80">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Client-Side</span>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100 hover:text-stone-900 cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-navigation-drawer" className="lg:hidden border-t border-stone-200 bg-white px-4 py-4 space-y-4 max-h-[85vh] overflow-y-auto">
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => handleNav('/')}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-stone-900 hover:bg-stone-100"
            >
              Home & All Tools
            </button>
            <button
              type="button"
              onClick={() => handleNav('/about')}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-100"
            >
              About K27 Tools
            </button>
            <button
              type="button"
              onClick={() => handleNav('/privacy')}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-100"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => handleNav('/terms')}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-100"
            >
              Terms of Service
            </button>
            <button
              type="button"
              onClick={() => handleNav('/contact')}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-100"
            >
              Contact Support
            </button>
          </div>

          <div className="pt-3 border-t border-stone-100">
            <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
              Tool Categories
            </div>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES_CONFIG.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleNav(`/category/${cat.id}`)}
                  className="flex items-center gap-2 p-2.5 rounded-lg border border-stone-200 text-left hover:border-stone-400 bg-stone-50 text-xs font-medium text-stone-800"
                >
                  {getToolIcon(cat.iconName, { className: 'w-4 h-4 text-stone-700' })}
                  <span className="truncate">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
