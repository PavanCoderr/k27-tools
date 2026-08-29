/**
 * AdSlot — Compatibility wrapper
 *
 * This file preserves the existing import interface used across the project:
 *   import { AdSlot } from '../components/AdSlot';
 *
 * It delegates to the new centralized ad system at src/components/ads/AdSlot.tsx
 * which reads from src/config/ads.ts.
 *
 * To change ad behavior, edit src/config/ads.ts — NOT individual tool pages.
 */

import React from 'react';
import { AdSlot as CentralizedAdSlot } from './ads/AdSlot';

interface AdSlotProps {
  /** Legacy position prop — mapped to centralized placement names */
  position: 'top' | 'middle' | 'bottom' | 'sidebar';
  /** Additional CSS classes */
  className?: string;
}

/**
 * Maps the legacy position prop to the centralized placement system.
 *
 * The mapping assumes this component is used in one of three contexts:
 *   - Tool pages (ToolLayout)  → toolTop / toolMiddle / toolBottom
 *   - Home page (HomePage)     → homeTop / homeMiddle / homeBottom
 *   - Category pages           → categoryTop / categoryBottom
 *
 * Since we cannot know the context from props alone, we use the
 * position string to pick the most common mapping. Pages that need
 * specific placements should import from './ads/AdSlot' directly.
 */
function mapPositionToPlacement(
  position: 'top' | 'middle' | 'bottom' | 'sidebar'
): 'toolTop' | 'toolMiddle' | 'toolBottom' | 'homeTop' | 'homeMiddle' | 'homeBottom' | 'categoryTop' | 'categoryBottom' {
  switch (position) {
    case 'top':
      return 'toolTop';
    case 'middle':
      return 'toolMiddle';
    case 'bottom':
      return 'toolBottom';
    case 'sidebar':
      return 'toolMiddle'; // sidebar is unused in current layout; map to middle
    default:
      return 'toolTop';
  }
}

export const AdSlot: React.FC<AdSlotProps> = ({ position, className = '' }) => {
  const placement = mapPositionToPlacement(position);
  return <CentralizedAdSlot placement={placement} className={className} />;
};
