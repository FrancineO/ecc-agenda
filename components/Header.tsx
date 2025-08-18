"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MultiDayConferenceService } from '../services/MultiDayConferenceService';
import './Header.css';

interface HeaderProps {
  currentRegion?: string;
  currentDay?: string;
}

export default function Header({ currentRegion, currentDay }: HeaderProps) {
  const router = useRouter();
  
  // Get regions list
  const regions = MultiDayConferenceService.getRegionsList();
  
  const handleRegionChange = (regionKey: string) => {
    if (currentDay) {
      router.push(`/${regionKey}/${currentDay}`);
    } else {
      router.push(`/${regionKey}`);
    }
  };

  return (
    <header className="conference-header">
      <div className="header-container">
        {/* Header with Logo, Title, and Region Selector */}
        <div className="header-top">
          <div className="logo-section">
            <Image 
              src="https://pega.micecon.com/uploads/images/logo/pega-logo.png"
              alt="PEGA Logo"
              width={120}
              height={40}
              className="pega-logo-img"
            />
            <div className="conference-title">
              ECC 2025 Agenda
            </div>
          </div>
          
          {/* Region Selector */}
          {currentRegion && (
            <div className="header-region-selector">
              <label className="region-selector-label">Region:</label>
              
              {/* Desktop Buttons */}
              <div className="region-selector-buttons">
                {regions.map((region) => (
                  <button
                    key={region.key}
                    onClick={() => handleRegionChange(region.key)}
                    className={`region-selector-button ${currentRegion === region.key ? 'active' : ''}`}
                    title={region.description}
                  >
                    {region.name}
                  </button>
                ))}
              </div>
              
              {/* Mobile Dropdown */}
              <div className="region-selector-dropdown">
                <select
                  value={currentRegion}
                  onChange={(e) => handleRegionChange(e.target.value)}
                  className="region-dropdown"
                >
                  {regions.map((region) => (
                    <option key={region.key} value={region.key}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
