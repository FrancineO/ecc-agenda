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
  type: 'keynote' | 'session' | 'workshop' | 'break' | 'closing' | 'coffee' | 'drinks' | 'meal';
  imageUrl?: string;
  isCommon?: boolean;
}

export interface DayData {
  date: string;
  dateFormatted: string;
  theme: string;
  agenda: AgendaItem[];
}

export interface BreakoutGroupData {
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
  capacity?: number;
  description: string;
  mapLink?: string;
}

export interface ConferenceInfo {
  name: string;
  startDate: string;
  endDate: string;
  venue: string;
  description: string;
}

export class MultiDayConferenceService {
  // Helper function to convert time string to minutes for proper sorting
  private static timeToMinutes(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // Helper function to sort agenda items by time
  private static sortAgendaByTime(agenda: AgendaItem[]): AgendaItem[] {
    return agenda.sort((a, b) => {
      const timeA = this.timeToMinutes(a.time);
      const timeB = this.timeToMinutes(b.time);
      return timeA - timeB;
    });
  }

  static getConferenceInfo(): ConferenceInfo {
    return multiDayData.conference;
  }

  static getAllBreakoutGroups(): { [key: string]: BreakoutGroupData } {
    return multiDayData.breakoutGroups as { [key: string]: BreakoutGroupData };
  }

  static getBreakoutGroupData(breakoutGroupKey: string): BreakoutGroupData | null {
    const breakoutGroups = multiDayData.breakoutGroups as { [key: string]: BreakoutGroupData };
    return breakoutGroups[breakoutGroupKey] || null;
  }

  static getAllDays(breakoutGroupKey?: string): { [key: string]: DayData } {
    // Get common sessions for all days
    const commonDays = multiDayData.commonSessions as { [key: string]: DayData };
    
    if (!breakoutGroupKey) {
      return commonDays;
    }

    // Merge common sessions with breakout group sessions
    const breakoutGroupData = this.getBreakoutGroupData(breakoutGroupKey);
    const mergedDays: { [key: string]: DayData } = {};

    // Start with common sessions
    Object.entries(commonDays).forEach(([dayKey, dayData]) => {
      mergedDays[dayKey] = { ...dayData };
    });

    // Add breakout group sessions if they exist
    if (breakoutGroupData && breakoutGroupData.days) {
      Object.entries(breakoutGroupData.days).forEach(([dayKey, breakoutGroupDayData]) => {
        if (mergedDays[dayKey]) {
          // Merge breakout group agenda with common agenda and sort by time
          const combinedAgenda = [
            ...mergedDays[dayKey].agenda,
            ...breakoutGroupDayData.agenda
          ];
          mergedDays[dayKey] = {
            ...mergedDays[dayKey],
            agenda: this.sortAgendaByTime(combinedAgenda)
          };
        } else {
          // Day exists only in breakout group data
          mergedDays[dayKey] = {
            ...breakoutGroupDayData,
            agenda: this.sortAgendaByTime(breakoutGroupDayData.agenda)
          };
        }
      });
    }

    // Sort common-only days as well
    Object.keys(mergedDays).forEach(dayKey => {
      if (!breakoutGroupData?.days?.[dayKey]) {
        mergedDays[dayKey].agenda = this.sortAgendaByTime(mergedDays[dayKey].agenda);
      }
    });

    return mergedDays;
  }

  static getDayData(dayKey: string, breakoutGroupKey?: string): DayData | null {
    const days = this.getAllDays(breakoutGroupKey);
    return days[dayKey] || null;
  }

  static getAgendaForDay(dayKey: string, breakoutGroupKey?: string): AgendaItem[] {
    const dayData = this.getDayData(dayKey, breakoutGroupKey);
    const agenda = dayData ? dayData.agenda as AgendaItem[] : [];
    return this.sortAgendaByTime(agenda);
  }

  static getCommonSessions(): { [key: string]: DayData } {
    return multiDayData.commonSessions as { [key: string]: DayData };
  }

  static getBreakoutGroupSessions(breakoutGroupKey: string): { [key: string]: DayData } {
    const breakoutGroupData = this.getBreakoutGroupData(breakoutGroupKey);
    return breakoutGroupData ? breakoutGroupData.days : {};
  }

  static getAllSpeakers(): Speaker[] {
    return (multiDayData as { speakers?: Speaker[] }).speakers || [];
  }

  static getSpeaker(speakerId: string): Speaker | undefined {
    const speakers = this.getAllSpeakers();
    return speakers.find((speaker: Speaker) => speaker.id === speakerId);
  }

  static getAllRooms(): Room[] {
    return multiDayData.rooms;
  }

  static getRoom(roomId: string): Room | undefined {
    return multiDayData.rooms.find(room => room.id === roomId);
  }

  static getFeaturedSessionsForDay(dayKey: string, breakoutGroupKey?: string): AgendaItem[] {
    const agenda = this.getAgendaForDay(dayKey, breakoutGroupKey);
    return agenda.filter(item => 
      !item.isBreak && 
      (item.type === 'keynote' || item.tags.includes('Featured'))
    ).slice(0, 3);
  }

  static getAgendaByTimeSlotsForDay(dayKey: string, breakoutGroupKey?: string): { time: string; items: AgendaItem[] }[] {
    const agenda = this.getAgendaForDay(dayKey, breakoutGroupKey);
    const timeSlots: { [key: string]: AgendaItem[] } = {};
    
    agenda.forEach(item => {
      if (!timeSlots[item.time]) {
        timeSlots[item.time] = [];
      }
      timeSlots[item.time].push(item);
    });
    
    return Object.entries(timeSlots)
      .map(([time, items]) => ({ time, items }))
      .sort((a, b) => {
        const timeA = this.timeToMinutes(a.time);
        const timeB = this.timeToMinutes(b.time);
        return timeA - timeB;
      });
  }

  static searchAgenda(query: string, breakoutGroupKey?: string): { day: string; items: AgendaItem[] }[] {
    const results: { day: string; items: AgendaItem[] }[] = [];
    const searchTerm = query.toLowerCase();
    
    const days = this.getAllDays(breakoutGroupKey);
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

  static getSessionsByTag(tag: string, breakoutGroupKey?: string): { day: string; items: AgendaItem[] }[] {
    const results: { day: string; items: AgendaItem[] }[] = [];
    
    const days = this.getAllDays(breakoutGroupKey);
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

  static getDayThemes(breakoutGroupKey?: string): { day: string; theme: string; date: string }[] {
    const days = this.getAllDays(breakoutGroupKey);
    return Object.entries(days).map(([dayKey, dayData]) => ({
      day: dayKey,
      theme: dayData.theme,
      date: dayData.dateFormatted
    }));
  }

  static getBreakoutGroupsList(): { key: string; name: string; description: string }[] {
    const breakoutGroups = this.getAllBreakoutGroups();
    return Object.entries(breakoutGroups).map(([breakoutGroupKey, breakoutGroupData]) => ({
      key: breakoutGroupKey,
      name: breakoutGroupData.name,
      description: breakoutGroupData.description
    }));
  }

  static getCurrentConferenceDay(): string | null {
    const today = new Date();
    const conferenceInfo = this.getConferenceInfo();
    
    // Conference dates
    const startDate = new Date(conferenceInfo.startDate);
    const endDate = new Date(conferenceInfo.endDate);
    
    // If today is before the conference, return the first day
    if (today < startDate) {
      return 'thursday';
    }
    
    // If today is after the conference, return the last day
    if (today > endDate) {
      return 'saturday';
    }

    // If today is during the conference, determine which day of the week it is
    const dayOfWeek = today.getDay();

    switch (dayOfWeek) {
      case 3: return 'thursday';  // November 20
      case 4: return 'friday';    // November 21
      case 5: return 'saturday';  // November 22
      default: return 'thursday'; // Fallback to first day
    }
  }
}
