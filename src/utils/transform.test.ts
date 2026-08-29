import { describe, expect, it } from 'vitest';
import { webcrypto } from 'node:crypto';
import { escapeWifiValue, generateUuid, parsePageNumbers } from './transform';

Object.defineProperty(globalThis, 'crypto', { value: webcrypto });

describe('escapeWifiValue', () => {
  it('escapes Wi-Fi payload delimiters and backslashes', () => {
    expect(escapeWifiValue('Cafe;5G:guest, "today"\\now')).toBe('Cafe\\;5G\\:guest\\, \\"today\\"\\\\now');
  });

  it('leaves ordinary values unchanged', () => {
    expect(escapeWifiValue('network-name_123')).toBe('network-name_123');
  });
});

describe('parsePageNumbers', () => {
  it('supports ranges, lists, duplicates, and preserves numeric order', () => {
    expect(parsePageNumbers('3, 1-3, 8-9, 3', 10)).toEqual([0, 1, 2, 7, 8]);
  });

  it('ignores empty, malformed, reversed, and out-of-bounds selections', () => {
    expect(parsePageNumbers(' ,abc, 4-, 6-2, 0, 11, 2x', 10)).toEqual([]);
  });

  it('clips partially out-of-bounds ranges', () => {
    expect(parsePageNumbers('-2, 8-12', 10)).toEqual([7, 8, 9]);
  });
});

describe('generateUuid', () => {
  it('returns an RFC 4122 version 4 UUID', () => {
    const uuid = generateUuid();
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  it('generates distinct values across a batch', () => {
    const values = new Set(Array.from({ length: 100 }, generateUuid));
    expect(values).toHaveLength(100);
  });
});