import { SiteConfig } from '../types';

export const SITE_CONFIG: SiteConfig = {
  siteName: 'K27 Tools',
  tagline: 'Simple tools. Fast results.',
  siteUrl: 'https://k27tools.dpdns.org',
  contactEmail: 'support@k27tools.dpdns.org',
  githubUrl: '',
  adsEnabled: false, // Set to true when integrating live ad network tags
  analyticsEnabled: false, // Set to true when configured
};

export const CATEGORIES_CONFIG = [
  {
    id: 'json',
    name: 'JSON Tools',
    shortDescription: 'Format, validate, and convert JSON datasets easily.',
    description: 'High-speed browser tools to format, minify, validate, and transform JSON arrays to CSV with zero server uploads.',
    iconName: 'Braces',
    color: 'amber',
  },
  {
    id: 'image',
    name: 'Image Tools',
    shortDescription: 'Compress, resize, and convert JPG, PNG, and WebP images.',
    description: 'Client-side image tools that compress file sizes, resize dimensions, and convert across JPG, PNG, and modern WebP formats.',
    iconName: 'Image',
    color: 'emerald',
  },
  {
    id: 'text',
    name: 'Text Tools',
    shortDescription: 'Count words, format whitespace, and switch letter casing.',
    description: 'Instant text analysis counters for words and characters, line formatters, duplicate removers, and case converters.',
    iconName: 'FileText',
    color: 'blue',
  },
  {
    id: 'developer',
    name: 'Developer Tools',
    shortDescription: 'Base64, URL encoding, UUIDs, JWT decoding, and crypto hashes.',
    description: 'Essential utility toolbox for developers: Base64 encode/decode, URL encoding, UUID v4 generator, JWT inspector, and SHA hash generators.',
    iconName: 'Code2',
    color: 'indigo',
  },
  {
    id: 'pdf',
    name: 'PDF Tools',
    shortDescription: 'Merge documents, split pages, and compress PDF files.',
    description: 'Secure, client-side PDF utilities to merge multiple documents into one, extract pages, and optimize document size.',
    iconName: 'FileCheck2',
    color: 'rose',
  },
  {
    id: 'qr',
    name: 'QR Tools',
    shortDescription: 'Generate custom QR codes for URLs, text, and contact info.',
    description: 'Fast, customized QR code generator with adjustable error correction, sizes, and instant high-res PNG/SVG downloads.',
    iconName: 'QrCode',
    color: 'violet',
  },
] as const;
