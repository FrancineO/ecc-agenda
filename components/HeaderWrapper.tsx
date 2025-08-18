"use client";

import { usePathname } from 'next/navigation';
import Header from './Header';

export default function HeaderWrapper() {
  const pathname = usePathname();
  
  // Extract region and day from pathname
  const pathSegments = pathname.split('/').filter(Boolean);
  const currentRegion = pathSegments[0];
  const currentDay = pathSegments[1];
  
  // Only show region selector if we're in a region page
  const showRegionSelector = currentRegion && ['west', 'south', 'north'].includes(currentRegion);
  
  return (
    <Header 
      currentRegion={showRegionSelector ? currentRegion : undefined}
      currentDay={currentDay}
    />
  );
}
