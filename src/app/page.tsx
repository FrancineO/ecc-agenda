"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MultiDayConferenceService } from '../../services/MultiDayConferenceService';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Get the first available region and day
    const regions = MultiDayConferenceService.getRegionsList();
    const firstRegion = regions[0];
    
    if (firstRegion) {
      const allDays = MultiDayConferenceService.getAllDays(firstRegion.key);
      const firstDay = Object.keys(allDays)[0];
      
      if (firstDay) {
        // Redirect to the first region and day
        router.push(`/${firstRegion.key}/${firstDay}`);
      }
    }
  }, [router]);

  // Show loading while redirecting
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'Arial, sans-serif',
      color: '#003366'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2>Loading Conference Agenda...</h2>
        <p>Redirecting to schedule...</p>
      </div>
    </div>
  );
}
