"use client";

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import classNames from 'classnames';
import { MultiDayConferenceService } from '../../../../services/MultiDayConferenceService';
import AnimatedCardWrapper from '../../../../components/AnimatedCardWrapper';
import '@/styles/iframe-corporate.css';
import '@/styles/animations.css';

interface RegionDayClientProps {
  region: string;
  day: string;
}

export default function RegionDayClient({ region, day }: RegionDayClientProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const activeRegion = region;
  const activeTab = day;
  
  // Get conference info from JSON
  const conferenceInfo = MultiDayConferenceService.getConferenceInfo();
  
  // Get regions list
  const regions = MultiDayConferenceService.getRegionsList();
  
  // Validate region and day parameters
  const isValidRegion = regions.some(r => r.key === activeRegion);
  const allDays = MultiDayConferenceService.getAllDays(activeRegion);
  const isValidDay = Object.keys(allDays).includes(activeTab);

  // Redirect to home if invalid parameters
  useEffect(() => {
    if (!isValidRegion || !isValidDay) {
      router.push('/');
    }
  }, [activeRegion, activeTab, isValidRegion, isValidDay, router]);

  // Get agenda data for current region and day
  const getCurrentDayAgenda = () => {
    try {
      return MultiDayConferenceService.getAgendaForDay(activeTab, activeRegion);
    } catch (e) {
      console.error('Error loading agenda:', e);
      return [];
    }
  };

  // Get tab data dynamically from JSON for current region
  const getTabsFromData = () => {
    const allDays = MultiDayConferenceService.getAllDays(activeRegion);
    return Object.entries(allDays).map(([dayKey, dayData]) => ({
      id: dayKey,
      label: dayKey.charAt(0).toUpperCase() + dayKey.slice(1),
      date: new Date(dayData.date).toLocaleDateString('en-US', { 
        day: 'numeric', 
        month: 'long' 
      }),
      dateFormatted: dayData.dateFormatted,
      theme: dayData.theme
    }));
  };

  const tabs = getTabsFromData();
  const currentTab = tabs.find(tab => tab.id === activeTab) || tabs[0];
  const currentRegion = regions.find(region => region.key === activeRegion) || regions[0];
  const agendaData = getCurrentDayAgenda();

  const handleTabChange = (tabId: string) => {
    router.push(`/${activeRegion}/${tabId}`);
  };

  const handleRegionChange = (regionKey: string) => {
    router.push(`/${regionKey}/${activeTab}`);
  };

  // Don't render if invalid parameters
  if (!isValidRegion || !isValidDay) {
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
          <h2>Loading...</h2>
          <p>Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="iframe-container">
      {/* Header */}
      <div className="iframe-header">
        <h1 className="iframe-title">{conferenceInfo.name}</h1>
        <p className="iframe-subtitle">
          {new Date(conferenceInfo.startDate).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          })} - {new Date(conferenceInfo.endDate).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })} | {conferenceInfo.venue}
        </p>
      </div>

      {/* Agenda Section */}
      <div className="agenda-section">
        <h2 className="agenda-title">Agenda</h2>

        {/* Region Selection */}
        <div className="region-selection">
          <h3 className="region-selector-title">Select Region for Breakouts:</h3>
          <div className="region-buttons">
            {regions.map((region) => (
              <button
                key={region.key}
                onClick={() => handleRegionChange(region.key)}
                className={classNames(
                  'region-button',
                  { 'active': activeRegion === region.key }
                )}
                title={region.description}
              >
                {region.name}
              </button>
            ))}
          </div>
          <p className="region-description">
            {currentRegion?.description} - Regional breakout sessions will be shown alongside common sessions
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={classNames(
                'tab-button',
                { 'active': activeTab === tab.id }
              )}
            >
              {tab.label},
              <br/>
              <span className='tab-button-date'>
                {tab.date}</span>
            </button>
          ))}
        </div>

        {/* Current Day Info */}
        <div className="current-day-info">
          <h2 className="current-day-title">{currentTab?.label}</h2>
          <p className="current-day-date">{currentTab?.dateFormatted}</p>
          <p className="current-day-theme">{currentTab?.theme}</p>
        </div>

        {/* Sessions with Animation */}
        <div className="sessions-container">
          {agendaData.map((item, index) => (
            <AnimatedCardWrapper 
              key={`${activeTab}-${item.id || index}`} 
              delay={index * 150}
              animationType="fadeInUp"
            >
              <div
                className={classNames(
                  'session-card',
                  { 
                    'break-card': item.isBreak,
                    'common-session': item.isCommon === true,
                    'regional-session': item.isCommon === false
                  }
                )}
              >
                {/* Session Type Badge */}
                {!item.isBreak && (
                  <div className={classNames(
                    'session-type-badge',
                    { 
                      'common-badge': item.isCommon === true,
                      'regional-badge': item.isCommon === false
                    }
                  )}>
                    {item.isCommon ? '🌐 Common Session' : '📍 Regional Breakout'}
                  </div>
                )}
                
                {item.isBreak ? (
                  // Break session
                  <div>
                    <h3 className="break-card-title">{item.title}</h3>
                    <div className="break-card-time">
                      {item.time} - {item.endTime}
                    </div>
                  </div>
                ) : (
                  // Regular session
                  <div>
                    <div className="session-header">
                      <span className="session-time">{item.time}</span>
                      <span className="session-duration">{item.duration}</span>
                    </div>
                    
                    <h3 className="session-title">{item.title}</h3>
                    
                    {item.speaker && (
                      <div className="session-speaker">
                        {item.speaker}
                        {item.speakerTitle && `, ${item.speakerTitle}`}
                      </div>
                    )}
                    
                    <p className="session-description">{item.description}</p>
                    
                    <div className="session-room">
                      📍 {item.room}
                    </div>
                    
                    {item.tags && item.tags.length > 0 && (
                      <div className="session-tags">
                        {item.tags.map((tag: string, tagIndex: number) => (
                          <span key={tagIndex} className="session-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </AnimatedCardWrapper>
          ))}
        </div>
      </div>
    </div>
  );
}
