import React, { useState } from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { ShieldCheck, FileCheck, Info, Mail, CheckCircle2, Lock, Send } from 'lucide-react';
import { SITE_CONFIG } from '../config/site';

interface StaticPageProps {
  onNavigate: (path: string) => void;
}

export const NotFoundPage: React.FC<StaticPageProps> = ({ onNavigate }) => (
  <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center space-y-4">
    <Breadcrumb items={[{ label: 'Page Not Found' }]} onNavigate={onNavigate} />
    <h1 className="text-3xl font-black text-stone-900 tracking-tight">Page not found</h1>
    <p className="text-sm text-stone-600">The page you requested does not exist.</p>
    <button type="button" onClick={() => onNavigate('/')} className="px-4 py-2 rounded-lg bg-stone-900 text-white text-xs font-semibold">
      Return home
    </button>
  </div>
);

export const PrivacyPolicyPage: React.FC<StaticPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Breadcrumb items={[{ label: 'Privacy Policy' }]} onNavigate={onNavigate} />

      <div className="space-y-2 border-b border-stone-200 pb-4">
        <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Zero Server Uploads</span>
        </div>
        <h1 className="text-3xl font-black text-stone-900 tracking-tight">Privacy Policy</h1>
        <p className="text-xs text-stone-500">Last updated: August 29, 2026</p>
      </div>

      <div className="prose prose-stone text-xs text-stone-600 space-y-4 leading-relaxed">
        <h2 className="text-base font-bold text-stone-900">1. Overview & Commitment to Privacy</h2>
        <p>
          At K27 Tools, we strongly believe that utility tools should never compromise user privacy.
          Unlike conventional web converters, our entire utility suite executes <strong>100% client-side</strong> inside your web browser.
        </p>

        <h2 className="text-base font-bold text-stone-900">2. Zero Server-Side File Storage</h2>
        <p>
          When you upload an image, format JSON, decode a JWT token, merge PDF documents, or generate a QR code,
          your data is processed exclusively in your device's memory using HTML5 Canvas, Web Cryptography, and WebAssembly APIs.
          <strong> We never transmit, store, or log your file contents, text, or tokens to any external server.</strong>
        </p>

        <h2 className="text-base font-bold text-stone-900">3. Cookies, Advertising, and Analytics</h2>
        <p>
          K27 Tools does not currently enable advertising or analytics. If these services are enabled in the future,
          Google and other approved partners may use cookies, web beacons, IP addresses, and similar identifiers to measure
          traffic and serve ads, including personalized ads where legally permitted. We will update this policy and provide
          any required consent controls before enabling those services.
        </p>

        <p>
          For information about how Google uses data when you use sites that use its services, see{' '}
          <a
            href="https://policies.google.com/technologies/partner-sites"
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone-900 font-semibold underline"
          >
            How Google uses data when you use our partners' sites or apps
          </a>.
        </p>

        <h2 className="text-base font-bold text-stone-900">4. External Services</h2>
        <p>
          The site currently loads fonts from Google Fonts. Your browser may contact Google to retrieve those font files.
          Tool inputs and uploaded files are not sent to Google Fonts or any K27 Tools server.
        </p>

        <h2 className="text-base font-bold text-stone-900">5. Contact Information</h2>
        <p>
          For any privacy inquiries or technical questions regarding client-side processing, contact us at{' '}
          <a href={`mailto:${SITE_CONFIG.contactEmail}`} className="text-stone-900 font-semibold underline">
            {SITE_CONFIG.contactEmail}
          </a>.
        </p>
      </div>
    </div>
  );
};

export const TermsPage: React.FC<StaticPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Breadcrumb items={[{ label: 'Terms of Service' }]} onNavigate={onNavigate} />

      <div className="space-y-2 border-b border-stone-200 pb-4">
        <div className="flex items-center gap-2 text-stone-500 text-xs font-semibold uppercase tracking-wider">
          <FileCheck className="w-4 h-4" />
          <span>Legal Agreement</span>
        </div>
        <h1 className="text-3xl font-black text-stone-900 tracking-tight">Terms of Service</h1>
        <p className="text-xs text-stone-500">Last updated: August 2026</p>
      </div>

      <div className="prose prose-stone text-xs text-stone-600 space-y-4 leading-relaxed">
        <h2 className="text-base font-bold text-stone-900">1. Acceptance of Terms</h2>
        <p>
          By accessing and using K27 Tools, you accept and agree to be bound by these Terms of Service.
          All tools are provided completely free of charge for personal, educational, and commercial purposes.
        </p>

        <h2 className="text-base font-bold text-stone-900">2. Disclaimer of Warranty</h2>
        <p>
          All utilities are provided "as is" without warranty of any kind, express or implied.
          While we strive for 100% mathematical accuracy, K27 Tools is not liable for any data loss,
          corruption, or business interruption arising from tool usage.
        </p>

        <h2 className="text-base font-bold text-stone-900">3. Permitted Use</h2>
        <p>
          You agree not to use the service for any unlawful activities or in a manner that attempts to overwhelm or disrupt the infrastructure.
        </p>
      </div>
    </div>
  );
};

export const AboutPage: React.FC<StaticPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Breadcrumb items={[{ label: 'About K27 Tools' }]} onNavigate={onNavigate} />

      <div className="space-y-2 border-b border-stone-200 pb-4">
        <div className="flex items-center gap-2 text-stone-500 text-xs font-semibold uppercase tracking-wider">
          <Info className="w-4 h-4" />
          <span>Our Mission</span>
        </div>
        <h1 className="text-3xl font-black text-stone-900 tracking-tight">About K27 Tools</h1>
      </div>

      <div className="space-y-6 text-xs text-stone-600 leading-relaxed">
        <p className="text-sm text-stone-800 font-medium">
          K27 Tools was built with a simple premise: everyday digital tools should be instant, reliable, and respectful of your data.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-stone-900 font-bold">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Privacy First</span>
            </div>
            <p className="text-stone-500">
              We engineered all 20+ utilities to execute purely client-side within your browser. No files or text ever get transmitted to our servers.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-stone-900 font-bold">
              <CheckCircle2 className="w-4 h-4 text-amber-500" />
              <span>$0 Cost, Forever Free</span>
            </div>
            <p className="text-stone-500">
              No subscription tiers, no paywalls, and no account requirements. Everything is accessible in one unified place.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ContactPage: React.FC<StaticPageProps> = ({ onNavigate }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '', toolRequest: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = formData.toolRequest ? `Tool request: ${formData.toolRequest}` : 'K27 Tools feedback';
    const body = `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`;
    window.location.href = `mailto:${SITE_CONFIG.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Breadcrumb items={[{ label: 'Contact & Feedback' }]} onNavigate={onNavigate} />

      <div className="space-y-2 border-b border-stone-200 pb-4">
        <div className="flex items-center gap-2 text-stone-500 text-xs font-semibold uppercase tracking-wider">
          <Mail className="w-4 h-4" />
          <span>Get in Touch</span>
        </div>
        <h1 className="text-3xl font-black text-stone-900 tracking-tight">Contact & Tool Requests</h1>
        <p className="text-xs text-stone-600">
          Have a suggestion, bug report, or want to request a new free tool? We'd love to hear from you.
        </p>
      </div>

      {submitted ? (
        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2 text-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
          <h3 className="text-sm font-bold">Thank you for your message!</h3>
          <p className="text-xs text-emerald-700">
            We appreciate your feedback and tool suggestions. Our team reviews all requests.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Your Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs focus:outline-none focus:ring-1 focus:ring-stone-900"
                placeholder="Alex Morgan"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs focus:outline-none focus:ring-1 focus:ring-stone-900"
                placeholder="alex@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Tool You'd Like to Request (Optional)
            </label>
            <input
              type="text"
              value={formData.toolRequest}
              onChange={(e) => setFormData({ ...formData, toolRequest: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs focus:outline-none"
              placeholder="e.g. Markdown to HTML, SVG Optimizer..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Message or Bug Details</label>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full p-3 rounded-lg border border-stone-300 text-xs focus:outline-none"
              placeholder="Share your thoughts or feedback..."
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Feedback</span>
          </button>
        </form>
      )}
    </div>
  );
};
