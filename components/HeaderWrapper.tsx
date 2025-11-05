"use client";

import { usePathname } from 'next/navigation';
import Header from './Header';

export default function HeaderWrapper() {
  const pathname = usePathname();
  
  // Extract breakout-group and day from pathname
  const pathSegments = pathname.split('/').filter(Boolean);
  const currentBreakoutGroup = pathSegments[0];
  const currentDay = pathSegments[1];
  
  // Only show breakout group selector if we're in a breakout group page
  const validBreakoutGroups = ['management', 'delivery-circle-1', 'delivery-circle-2', 'delivery-circle-3', 'west', 'south', 'north'];
  const showBreakoutGroupSelector = currentBreakoutGroup && validBreakoutGroups.includes(currentBreakoutGroup);
  
  return (
    <Header 
      currentRegion={showBreakoutGroupSelector ? currentBreakoutGroup : undefined}
      currentDay={currentDay}
    />
  );
}
