import React, { useEffect, useRef, useState } from 'react';
import { AD_CONFIG } from '../../config/ads';
import { AdPlaceholder } from './AdPlaceholder';

interface AdSlotProps {
  /**
   * Placement identifier — maps to AD_CONFIG.placements[key]
   * When the placement is disabled in config, the slot renders nothing.
   */
  placement:
    | 'toolTop'
    | 'toolMiddle'
    | 'toolBottom'
    | 'homeTop'
    | 'homeMiddle'
    | 'homeBottom'
    | 'categoryTop'
    | 'categoryBottom';

  /** Additional CSS classes applied to the wrapper */
  className?: string;
}

/**
 * Responsive, centralized AdSlot component.
 *
 * Behaviour:
 *  - When AD_CONFIG.enabled === false  → renders AdPlaceholder (dev mode)
 *  - When AD_CONFIG.enabled === true   → renders the real ad-network container
 *  - When the specific placement is disabled in config → renders nothing
 *  - Uses IntersectionObserver for lazy loading when enabled
 *  - Detects viewport width to serve desktop vs mobile sizes
 */
export const AdSlot: React.FC<AdSlotProps> = ({ placement, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if this placement is enabled
  const isPlacementEnabled = AD_CONFIG.placements[placement] ?? true;

  // If master switch off OR placement off → render nothing
  if (!isPlacementEnabled) {
    return null;
  }

  // Determine responsive size
  const size = isMobile ? AD_CONFIG.sizes.mobile : AD_CONFIG.sizes.desktop;

  // Lazy-load via IntersectionObserver
  useEffect(() => {
    if (!AD_CONFIG.enabled || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // start loading 200px before visible
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Detect viewport width for responsive sizing
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    setIsMobile(mq.matches);

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Keep disabled ad placements out of the public UI until a network is configured.
  if (!AD_CONFIG.enabled) {
    return null;
  }

  // Ads enabled → render real ad container (lazy)
  return (
    <div
      ref={containerRef}
      id={`ad-slot-${placement}`}
      role="complementary"
      aria-label="Advertisement"
      className={`w-full flex justify-center items-center overflow-hidden my-4 ${className}`}
      style={{
        width: size.width,
        maxWidth: size.maxWidth,
        minHeight: size.minHeight,
        margin: '1rem auto',
      }}
    >
      {isVisible && (
        <AdNetworkContainer provider={AD_CONFIG.provider} placement={placement} />
      )}
    </div>
  );
};

/**
 * Internal component that renders the actual ad-network-specific markup.
 * This is the ONLY place where ad-network scripts should be injected.
 *
 * To add a new provider:
 *   1. Add a case to the switch below
 *   2. Import/load the network script lazily
 *   3. Render the network-specific container
 */
const AdNetworkContainer: React.FC<{
  provider: string;
  placement: string;
}> = ({ provider, placement }) => {
  switch (provider) {
    case 'adsense':
      return <AdsenseContainer placement={placement} />;

    case 'adsterra':
      return <AdsterraContainer placement={placement} />;

    default:
      return null;
  }
};

/**
 * Google AdSense container.
 *
 * When activated:
 *   1. Load the AdSense script once via <script> tag
 *   2. Render <ins class="adsbygoogle"> with appropriate data attributes
 *   3. Push to window.adsbygoogle to trigger ad rendering
 *
 * Publisher ID comes from AD_CONFIG.networks.adsense.publisherId
 * which reads from VITE_ADSENSE_PUBLISHER_ID env var.
 */
const AdsenseContainer: React.FC<{ placement: string }> = ({ placement }) => {
  const insRef = useRef<HTMLModElement>(null);
  const publisherId = AD_CONFIG.networks.adsense.publisherId;

  useEffect(() => {
    if (!publisherId || !insRef.current) return;

    // Load AdSense script if not already loaded
    if (!document.querySelector(`script[src*="adsbygoogle"][data-ad-client="${publisherId}"]`)) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }

    // Push ad unit
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).adsbygoogle.push({});
    } catch {
      // AdSense not yet loaded — will retry on next render
    }
  }, [publisherId]);

  if (!publisherId) {
    return (
      <div className="text-[10px] text-stone-400 text-center p-2">
        AdSense publisher ID not configured
      </div>
    );
  }

  return (
    <ins
      ref={insRef}
      className="adsbygoogle"
      style={{ display: 'block', width: '100%' }}
      data-ad-client={publisherId}
      data-ad-slot={placement}
      data-full-width-responsive="true"
    />
  );
};

/**
 * Adsterra container.
 *
 * When activated:
 *   1. Load the Adsterra script
 *   2. Render the placement container
 *
 * Zone ID comes from AD_CONFIG.networks.adsterra.zoneId
 * which reads from VITE_ADSTERRA_ZONE_ID env var.
 */
const AdsterraContainer: React.FC<{ placement: string }> = ({ placement }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const zoneId = AD_CONFIG.networks.adsterra.zoneId;

  useEffect(() => {
    if (!zoneId || !containerRef.current) return;

    // Load Adsterra script if not already loaded
    if (!document.querySelector('script[data-adsterra-loaded="true"]')) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `//pl${zoneId}.adsterra.com/${zoneId}.js`;
      script.dataset.adsterraLoaded = 'true';
      document.head.appendChild(script);
    }
  }, [zoneId]);

  if (!zoneId) {
    return (
      <div className="text-[10px] text-stone-400 text-center p-2">
        Adsterra zone ID not configured
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      id={`adsterra-${placement}`}
      className="adsterra-ad-container"
    />
  );
};
