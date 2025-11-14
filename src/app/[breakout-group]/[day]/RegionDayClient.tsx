"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import classNames from 'classnames';
import { MultiDayConferenceService, Room } from '../../../../services/MultiDayConferenceService';
import { getBreakoutGroupDisplayName } from '../../../../utils/breakoutGroupUtils';
import AnimatedCardWrapper from '../../../../components/AnimatedCardWrapper';
import RoomMapModal from '../../../../components/RoomMapModal';
import '@/styles/conference-agenda.css';
import '@/styles/animations.css';

interface User {
  pegaId: string;
  email: string;
  breakoutGroup: string;
  preferredName: string;
  lastName: string;
  regionalBreakout: string;
}

interface RegionDayClientProps {
  region: string;
  day: string;
}

export default function RegionDayClient({ region, day }: RegionDayClientProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const activeRegion = region;
  const activeTab = day;
  
  // Handle room click to open modal
  const handleRoomClick = (roomId: string) => {
    const roomData = MultiDayConferenceService.getRoom(roomId);
    if (roomData) {
      setSelectedRoom(roomData);
      setIsModalOpen(true);
    }
  };
  
  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRoom(null);
  };
  
  // Get room display name with description
  const getRoomDisplayName = (roomId: string) => {
    if (!roomId) return '';
    
    const roomData = MultiDayConferenceService.getRoom(roomId);
    if (roomData) {
      return `${roomData.name} - ${roomData.description}`;
    }
    
    // Fallback for unmapped room names
    return roomId;
  };

  // Get break type information for categorizing badges
  const getBreakTypeInfo = (item: { type?: string }) => {
    switch (item.type) {
      case 'coffee':
        return { type: 'coffee', emoji: '☕️', label: 'Coffee Break' };
      case 'meal':
        return { type: 'meal', emoji: '🍽️', label: 'Meal' };
      case 'drinks':
        return { type: 'drinks', emoji: '🍹', label: 'Drinks Break' };
      default:
        return { type: 'break', emoji: '▶️', label: 'Break' };
    }
  };

  // Get regions list
  const regions = MultiDayConferenceService.getBreakoutGroupsList();
  
  // Validate region and day parameters
  const isValidRegion = regions.some(r => r.key === activeRegion);
  const allDays = MultiDayConferenceService.getAllDays(activeRegion);
  const isValidDay = Object.keys(allDays).includes(activeTab);

  // Load current user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing stored user:', e);
      }
    }
  }, []);

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
    <div ref={containerRef} className="conference-container">
      
      {/* Agenda Section */}
      <div className="agenda-section">
        {/* Current User Info */}
        <div className="current-user-info">
          {currentUser && (
            <div>
              <h2 className="current-user-name">
                Welcome {currentUser.preferredName} {currentUser.lastName}
              </h2>
              <div className="user-assignment-info">
                <span className="breakout-group-info">
                  <strong>Breakout Group:</strong> {getBreakoutGroupDisplayName(activeRegion)}
                </span>
                <span className="region-info">
                  <strong>Region:</strong> {currentUser.regionalBreakout}
                </span>
              </div>
            </div>
          )}
          {/* <div className="current-day-info">
            <h3 className="current-day-title">{currentTab?.label}</h3>
            <p className="current-day-theme">{currentTab?.theme}</p>
          </div> */}
        </div>
        
        {/* Sticky Tab Navigation */}
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

        {/* Sessions Container */}
        <div className="sessions-container">
          {agendaData.map((item, index) => (
            <AnimatedCardWrapper 
              key={`${activeTab}-${item.id || index}`} 
              delay={index * 50}
              animationType="fadeInUp"
            >
              <div
                className={classNames(
                  'session-card',
                  {
                    'break-card': item.isBreak,
                    'common-session': item.isCommon === true,
                    'regional-session': item.isCommon === false
                  },
                  {
                    'coffee-card': item.type === 'coffee',
                    'drink-card': item.type === 'drinks',
                    'meal-card': item.type === 'meal'
                  }
                )}
              >
                {item.isBreak ? (
                  // Break session
                  <div>
                    <div className="session-top-row">
                      <div className='session-break-header'>
                        <span className="session-time">{item.time} - {item.endTime}</span>
                        <h3 className="session-title break-title">
                          {item.title}
                        </h3>
                      </div>
                      
                      <div className="session-top-right">
                        <span className="session-duration">{item.duration}</span>
                        {/* Break Type Badge */}
                        <div className={classNames(
                          'session-type-badge',
                          'break-badge',
                          `break-${getBreakTypeInfo(item).type}`
                        )}>
                          {getBreakTypeInfo(item).emoji}
                        </div>
                      </div>
                    </div>
                    
                    
                    
                    <p className="session-description">{item.description}</p>
                    
                    {item.room && (
                      <div className="session-room">
                        📍 <span 
                          className="room-clickable"
                          onClick={() => handleRoomClick(item.room)}
                        >
                          {getRoomDisplayName(item.room)}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  // Regular session
                  <div>
                    <div className="session-top-row">
                      <span className="session-time">{item.time} - {item.endTime}</span>
                      <div className="session-top-right">
                        <span className="session-duration">{item.duration}</span>
                        {/* Session Type Badge */}
                        <div className={classNames(
                          'session-type-badge',
                          { 
                            'common-badge': item.isCommon === true,
                            'regional-badge': item.isCommon === false
                          }
                        )}>
                          {(item.id === 'sat-opening-welcome' || item.id === 'sat-awards' || item.id === 'sat-interactive-session') && currentUser?.regionalBreakout && (
                            '📍'
                          ) || (item.isCommon ? '🌐' : '👥')}
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="session-title">
                      {item.title}
                      {(item.id === 'sat-opening-welcome' || item.id === 'sat-awards' || item.id === 'sat-interactive-session') && currentUser?.regionalBreakout && (
                        <span className="session-region"> ({currentUser.regionalBreakout})</span>
                      )}
                    </h3>
                    
                    {item.speaker && item.speaker != "RDs" && (
                      <div className="session-speaker">
                        {item.speaker}
                        {item.speakerTitle && (
                          <span>, <em>{item.speakerTitle}</em></span>
                        )}
                      </div>
                    )}

                    {item.speaker && item.speaker == "RDs" && (
                      <div className="session-speaker">
                        {currentUser && currentUser.regionalBreakout == 'Central' ? 'Thorsten Hagenberger' : currentUser?.regionalBreakout == 'North' ? 'Steve Tompkins, Sue Pitkin-Frost & Erik Sol' : 'Camille Coiffet'}
                      </div>
                    )}
                    
                    <p className="session-description">{item.description}</p>
                    
                    {item.room && item.room != "Regional Breakout Rooms" && (
                      <div className="session-room">
                        📍 <span 
                          className="room-clickable"
                          onClick={() => handleRoomClick(item.room)}
                        >
                          {getRoomDisplayName(item.room)}
                        </span>
                      </div>
                    )}

                    {item.room == "Regional Breakout Rooms" && (
                      <div className="session-room">
                        📍 <span 
                          className="room-clickable"
                          onClick={() => handleRoomClick(
                            currentUser && currentUser.regionalBreakout == 'Central' ? 'Belvedere' : 
                            currentUser?.regionalBreakout == 'North' ? 'Prague-ABCD' : 
                            'LoftOne'
                          )}
                        >
                          {currentUser && currentUser.regionalBreakout == 'Central' ? getRoomDisplayName('Belvedere') : currentUser?.regionalBreakout == 'North' ? getRoomDisplayName('Prague-ABCD') : getRoomDisplayName('LoftOne')}
                        </span>
                      </div>
                    )}
                    
                    {/* {item.tags && item.tags.length > 0 && (
                      <div className="session-tags">
                        {item.tags.map((tag: string, tagIndex: number) => (
                          <span key={tagIndex} className="session-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )} */}
                  </div>
                )}
              </div>
            </AnimatedCardWrapper>
          ))}
        </div>
      </div>
      
      {/* Room Map Modal */}
      <RoomMapModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        room={selectedRoom}
      />
      
      <style jsx>{`
        .room-clickable {
          color: #3b82f6;
          cursor: pointer;
          text-decoration: underline;
          transition: color 0.2s ease;
        }
        
        .room-clickable:hover {
          color: #1d4ed8;
          text-decoration: none;
        }
      `}</style>
    </div>
  );
}
