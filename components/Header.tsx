"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { MultiDayConferenceService } from "../services/MultiDayConferenceService";
import "./Header.css";

interface HeaderProps {
  currentRegion?: string;
  currentDay?: string;
}

export default function Header({ currentRegion, currentDay }: HeaderProps) {
  const router = useRouter();

  // // Get regions list
  // const regions = MultiDayConferenceService.getBreakoutGroupsList();

  // const handleBreakoutGroupChange = (breakoutGroupKey: string) => {
  //   if (currentDay) {
  //     router.push(`/${breakoutGroupKey}/${currentDay}`);
  //   } else {
  //     router.push(`/${breakoutGroupKey}`);
  //   }
  // };

  return (
    currentRegion && (
      <header className="conference-header">
        <div className="header-container">
          {/* Logo and Title Row */}
          <div className="header-top">
            <div className="logo-section">
              {/* Desktop Logo */}
              <Image
                src="https://pega.micecon.com/uploads/images/logo/pega-logo.png"
                alt="PEGA Logo"
                width={120}
                height={40}
                className="pega-logo-img desktop-logo"
              />
              {/* Mobile Logo */}
              <Image
                src="https://productleadersforum.org/wp-content/uploads/2024/02/pega_logo-e1707133201854.png"
                alt="PEGA Logo"
                width={120}
                height={40}
                className="pega-logo-img mobile-logo"
              />
              <div className="conference-title">ECC 2025 Agenda</div>
            </div>

            <div className="header-actions">
              <button
                onClick={() => router.push("/")}
                className="change-user-button"
                title="Change User"
              >
                Change User
              </button>
            </div>

            {/* Mobile Region Selector - Only visible on mobile */}
            {/* {currentRegion && (
            <div className="header-region-selector mobile-only">
              <label className="region-selector-label">Region:</label>
              
              <div className="region-selector-dropdown">
                <select
                  value={currentRegion}
                  onChange={(e) => handleBreakoutGroupChange(e.target.value)}
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
          )} */}
          </div>

          {/* Desktop Region Selector Row - Only visible on desktop */}
          {/* {currentRegion && (
          <div className="header-region-row desktop-only">
            <div className="header-region-selector">
              <label className="region-selector-label">Breakout Group:</label>
              
              <div className="region-selector-buttons">
                {regions.map((region) => (
                  <button
                    key={region.key}
                    onClick={() => handleBreakoutGroupChange(region.key)}
                    className={`region-selector-button ${currentRegion === region.key ? 'active' : ''}`}
                    title={region.description}
                  >
                    {region.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )} */}
        </div>
      </header>
    )
  );
}
