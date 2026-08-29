import React from 'react';

interface AdPlaceholderProps {
  /** Position identifier for debugging */
  position: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Subtle placeholder displayed when ads are disabled.
 *
 * Design principles:
 * - Visually minimal — does NOT look like a clickable ad
 * - No fake buttons, no deceptive CTAs
 * - Uses dashed border to clearly indicate "this is a placeholder"
 * - Only visible during development; hidden in production via ad-enabled toggle
 */
export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ position, className = '' }) => {
  return (
    <aside
      id={`ad-placeholder-${position}`}
      aria-label="Advertisement placeholder"
      className={`w-full my-4 rounded-lg border border-dashed border-stone-200/60 bg-stone-50/30 flex items-center justify-center ${className}`}
      style={{ minHeight: 60 }}
    >
      <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-stone-300 select-none pointer-events-none">
        ADVERTISEMENT
      </span>
    </aside>
  );
};
