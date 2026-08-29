import { describe, expect, it } from 'vitest';
import { SITE_CONFIG } from '../config/site';

describe('privacy configuration', () => {
  it('keeps the configured contact address on the privacy page source', async () => {
    const source = await import('./StaticPages?raw');
    expect(source.default).toContain('SITE_CONFIG.contactEmail');
    expect(SITE_CONFIG.contactEmail).toContain('@');
  });
});