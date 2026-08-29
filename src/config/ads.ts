/**
 * K27 Tools — Ad / Monetization Configuration
 *
 * This is the SINGLE source of truth for all ad-related settings.
 * All ad components read from this config. Do not hardcode ad-network
 * scripts in individual tool pages.
 *
 * To activate ads:
 *   1. Set AD_CONFIG.enabled = true
 *   2. Set AD_CONFIG.provider to 'adsense' or 'adsterra'
 *   3. Provide the required credentials (publisher ID / zone ID)
 *   4. Uncomment the corresponding script loader in AdSlot.tsx
 *
 * Environment variables (set in .env.local or Cloudflare Pages):
 *   VITE_ADSENSE_PUBLISHER_ID  — Google AdSense publisher ID (ca-pub-...)
 *   VITE_ADSTERRA_ZONE_ID      — Adsterra zone / placement ID
 */

export type AdProvider = 'none' | 'adsense' | 'adsterra';

export interface AdSize {
  width: string;
  maxWidth: number;
  minHeight: number;
}

export interface AdNetworkConfig {
  /** Google AdSense publisher ID (ca-pub-XXXXXXXX) — leave empty when inactive */
  publisherId: string;
  /** Adsterra zone / placement ID — leave empty when inactive */
  zoneId: string;
}

export const AD_CONFIG = {
  /** Master switch — set to true to enable live ads */
  enabled: false as boolean,

  /** Active ad network provider */
  provider: 'none' as AdProvider,

  /** Which placements are active (can disable individual slots) */
  placements: {
    toolTop: true,
    toolMiddle: true,
    toolBottom: true,
    homeTop: true,
    homeMiddle: true,
    homeBottom: true,
    categoryTop: true,
    categoryBottom: true,
  },

  /** Responsive ad container sizes */
  sizes: {
    desktop: {
      width: '100%',
      maxWidth: 728,   // fits 728x90, 300x250, 336x280
      minHeight: 90,
    } as AdSize,
    mobile: {
      width: '100%',
      maxWidth: 320,   // fits 320x100, 320x50, 300x250
      minHeight: 100,
    } as AdSize,
  },

  /** Network-specific credentials (read from env or hardcoded when ready) */
  networks: {
    adsense: {
      publisherId: import.meta.env.VITE_ADSENSE_PUBLISHER_ID || '',
    } as AdNetworkConfig,
    adsterra: {
      zoneId: import.meta.env.VITE_ADSTERRA_ZONE_ID || '',
    } as AdNetworkConfig,
  },
} as const;
