import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { CATEGORIES, TOOLS } from './tools';

describe('public sitemap coverage', () => {
  const sitemap = readFileSync('public/sitemap.xml', 'utf8');
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

  it('includes every tool and category route exactly once', () => {
    const expected = [
      'https://k27tools.dpdns.org/',
      ...TOOLS.map((tool) => `https://k27tools.dpdns.org${tool.route}`),
      ...CATEGORIES.map((category) => `https://k27tools.dpdns.org/category/${category.id}`),
      'https://k27tools.dpdns.org/about',
      'https://k27tools.dpdns.org/privacy',
      'https://k27tools.dpdns.org/terms',
      'https://k27tools.dpdns.org/contact',
    ];

    expect(new Set(urls)).toEqual(new Set(expected));
    expect(urls).toHaveLength(expected.length);
  });
});