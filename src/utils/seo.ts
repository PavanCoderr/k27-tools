import { SITE_CONFIG } from '../config/site';
import { ToolDefinition } from '../types';

export function updateSEO(tool?: ToolDefinition) {
  if (tool) {
    updatePageSeo({
      title: tool.seoTitle,
      description: tool.seoDescription,
      canonicalPath: tool.route,
      tool,
    });
  } else {
    updatePageSeo({});
  }
}

export function updatePageSeo(options: {
  title?: string;
  description?: string;
  canonicalPath?: string;
  tool?: ToolDefinition;
  robots?: string;
}) {
  const title = options.title || `${SITE_CONFIG.siteName} – ${SITE_CONFIG.tagline}`;
  const description = options.description || 'Fast, simple, and privacy-friendly free online developer, image, text, JSON, PDF, and QR utility tools running 100% locally.';
  const canonicalUrl = `${SITE_CONFIG.siteUrl}${options.canonicalPath || ''}`;

  // Update title
  document.title = title;

  // Update Meta Description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', description);

  upsertMeta('property', 'og:site_name', SITE_CONFIG.siteName);
  upsertMeta('property', 'og:locale', 'en_US');
  upsertMeta('name', 'twitter:url', canonicalUrl);
  upsertMeta('name', 'theme-color', '#1c1917');
  upsertMeta('name', 'robots', options.robots || 'index, follow');

  // OpenGraph Meta
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', title);

  let ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', description);

  let ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', canonicalUrl);

  // Canonical link tag
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', canonicalUrl);

  // Update Structured Data JSON-LD
  updateStructuredData(options.tool, canonicalUrl);
}

function upsertMeta(attribute: 'name' | 'property', value: string, content: string) {
  let meta = document.querySelector(`meta[${attribute}="${value}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, value);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

function updateStructuredData(tool: ToolDefinition | undefined, pageUrl: string) {
  // Remove existing dynamic script
  const existingScript = document.getElementById('k27-json-ld');
  if (existingScript) {
    existingScript.remove();
  }

  const script = document.createElement('script');
  script.id = 'k27-json-ld';
  script.type = 'application/ld+json';

  if (tool) {
    // Generate BreadcrumbList & SoftwareApplication & FAQPage schema
    const schemaGraph: Record<string, unknown>[] = [
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: tool.name,
        operatingSystem: 'Any',
        applicationCategory: 'UtilityApplication',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        description: tool.seoDescription,
        url: pageUrl,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: SITE_CONFIG.siteUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: tool.category.toUpperCase() + ' Tools',
            item: `${SITE_CONFIG.siteUrl}/category/${tool.category}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: tool.name,
            item: pageUrl,
          },
        ],
      },
    ];

    if (tool.faqs && tool.faqs.length > 0) {
      schemaGraph.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: tool.faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer,
          },
        })),
      });
    }

    script.text = JSON.stringify({ '@context': 'https://schema.org', '@graph': schemaGraph });
  } else {
    // Standard Website schema for home and informational pages
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_CONFIG.siteName,
      url: SITE_CONFIG.siteUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_CONFIG.siteUrl}/?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    });
  }

  document.head.appendChild(script);
}
