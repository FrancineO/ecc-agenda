import multiDayData from '../data/multi-day-agenda.json';

export interface AgendaItem {
  id: string;
  title: string;
  description: string;
  speaker: string;
  speakerTitle: string;
  time: string;
  endTime: string;
  duration: string;
  room: string;
  tags: string[];
  isBreak: boolean;
  type: 'keynote' | 'session' | 'workshop' | 'break' | 'closing';
  imageUrl?: string;
  isCommon?: boolean;
}

export interface DayData {
  date: string;
  dateFormatted: string;
  theme: string;
  agenda: AgendaItem[];
}

export interface RegionData {
  name: string;
  description: string;
  days: { [key: string]: DayData };
}

export interface Speaker {
  id: string;
  name: string;
  title: string;
  bio: string;
  imageUrl: string;
  social: {
    twitter?: string;
    linkedin?: string;
  };
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  description: string;
}

export interface ConferenceInfo {
  name: string;
  startDate: string;
  endDate: string;
  venue: string;
  description: string;
}

export class MultiDayConferenceService {
  static getConferenceInfo(): ConferenceInfo {
    return multiDayData.conference;
  }

  static getAllRegions(): { [key: string]: RegionData } {
    return multiDayData.regions as { [key: string]: RegionData };
  }

  static getRegionData(regionKey: string): RegionData | null {
    const regions = multiDayData.regions as { [key: string]: RegionData };
    return regions[regionKey] || null;
  }

  static getAllDays(regionKey?: string): { [key: string]: DayData } {
    // Get common sessions for all days
    const commonDays = multiDayData.commonSessions as { [key: string]: DayData };
    
    if (!regionKey) {
      return commonDays;
    }

    // Merge common sessions with regional sessions
    const regionData = this.getRegionData(regionKey);
    const mergedDays: { [key: string]: DayData } = {};

    // Start with common sessions
    Object.entries(commonDays).forEach(([dayKey, dayData]) => {
      mergedDays[dayKey] = { ...dayData };
    });

    // Add regional sessions if they exist
    if (regionData && regionData.days) {
      Object.entries(regionData.days).forEach(([dayKey, regionDayData]) => {
        if (mergedDays[dayKey]) {
          // Merge regional agenda with common agenda
          mergedDays[dayKey] = {
            ...mergedDays[dayKey],
            agenda: [
              ...mergedDays[dayKey].agenda,
              ...regionDayData.agenda
            ].sort((a, b) => a.time.localeCompare(b.time)) // Sort by time
          };
        } else {
          // Day exists only in regional data
          mergedDays[dayKey] = { ...regionDayData };
        }
      });
    }

    return mergedDays;
  }

  static getDayData(dayKey: string, regionKey?: string): DayData | null {
    const days = this.getAllDays(regionKey);
    return days[dayKey] || null;
  }

  static getAgendaForDay(dayKey: string, regionKey?: string): AgendaItem[] {
    const dayData = this.getDayData(dayKey, regionKey);
    return dayData ? dayData.agenda as AgendaItem[] : [];
  }

  static getCommonSessions(): { [key: string]: DayData } {
    return multiDayData.commonSessions as { [key: string]: DayData };
  }

  static getRegionalSessions(regionKey: string): { [key: string]: DayData } {
    const regionData = this.getRegionData(regionKey);
    return regionData ? regionData.days : {};
  }

  static getAllSpeakers(): Speaker[] {
    return multiDayData.speakers;
  }

  static getSpeaker(speakerId: string): Speaker | undefined {
    return multiDayData.speakers.find(speaker => speaker.id === speakerId);
  }

  static getAllRooms(): Room[] {
    return multiDayData.rooms;
  }

  static getRoom(roomId: string): Room | undefined {
    return multiDayData.rooms.find(room => room.id === roomId);
  }

  static getFeaturedSessionsForDay(dayKey: string, regionKey?: string): AgendaItem[] {
    const agenda = this.getAgendaForDay(dayKey, regionKey);
    return agenda.filter(item => 
      !item.isBreak && 
      (item.type === 'keynote' || item.tags.includes('Featured'))
    ).slice(0, 3);
  }

  static getAgendaByTimeSlotsForDay(dayKey: string, regionKey?: string): { time: string; items: AgendaItem[] }[] {
    const agenda = this.getAgendaForDay(dayKey, regionKey);
    const timeSlots: { [key: string]: AgendaItem[] } = {};
    
    agenda.forEach(item => {
      if (!timeSlots[item.time]) {
        timeSlots[item.time] = [];
      }
      timeSlots[item.time].push(item);
    });
    
    return Object.entries(timeSlots)
      .map(([time, items]) => ({ time, items }))
      .sort((a, b) => a.time.localeCompare(b.time));
  }

  static searchAgenda(query: string, regionKey?: string): { day: string; items: AgendaItem[] }[] {
    const results: { day: string; items: AgendaItem[] }[] = [];
    const searchTerm = query.toLowerCase();
    
    const days = this.getAllDays(regionKey);
    Object.entries(days).forEach(([dayKey, dayData]) => {
      const matchingItems = (dayData.agenda as AgendaItem[]).filter(item =>
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.speaker.toLowerCase().includes(searchTerm) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
      
      if (matchingItems.length > 0) {
        results.push({ day: dayKey, items: matchingItems });
      }
    });
    
    return results;
  }

  static getSessionsByTag(tag: string, regionKey?: string): { day: string; items: AgendaItem[] }[] {
    const results: { day: string; items: AgendaItem[] }[] = [];
    
    const days = this.getAllDays(regionKey);
    Object.entries(days).forEach(([dayKey, dayData]) => {
      const taggedItems = (dayData.agenda as AgendaItem[]).filter(item =>
        item.tags.some(itemTag => itemTag.toLowerCase() === tag.toLowerCase())
      );
      
      if (taggedItems.length > 0) {
        results.push({ day: dayKey, items: taggedItems });
      }
    });
    
    return results;
  }

  static getDayThemes(regionKey?: string): { day: string; theme: string; date: string }[] {
    const days = this.getAllDays(regionKey);
    return Object.entries(days).map(([dayKey, dayData]) => ({
      day: dayKey,
      theme: dayData.theme,
      date: dayData.dateFormatted
    }));
  }

  static getRegionsList(): { key: string; name: string; description: string }[] {
    const regions = this.getAllRegions();
    return Object.entries(regions).map(([regionKey, regionData]) => ({
      key: regionKey,
      name: regionData.name,
      description: regionData.description
    }));
  }
}
