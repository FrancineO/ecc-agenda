import { userDbService, User } from './UserDatabaseService';

export class UserLookupService {

  /**
   * Find a user by their email address or Pega ID
   * @param input - Email address or Pega ID
   * @returns User object if found, null otherwise
   */
  static async findUser(input: string): Promise<User | null> {
    if (!input) return null;
    
    try {
      return await userDbService.findUser(input);
    } catch (error) {
      console.error('Database error in UserLookupService:', error);
      return null;
    }
  }

  /**
   * Get the breakout group for a user
   * @param input - Email address or Pega ID
   * @returns Breakout group name if user found, null otherwise
   */
  static async getBreakoutGroup(input: string): Promise<string | null> {
    const user = await this.findUser(input);
    return user?.breakoutGroup || null;
  }

  /**
   * Get the default day based on current date
   * @returns Current day if within conference dates, otherwise Thursday by default
   */
  static getDefaultDay(): string {
    const today = new Date();
    const conferenceStart = new Date('2025-11-20'); // Thursday
    const conferenceEnd = new Date('2025-11-22');   // Saturday
    
    // If today is within conference dates, determine current day
    if (today >= conferenceStart && today <= conferenceEnd) {
      const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      
      if (dayOfWeek === 4) { // Thursday
        return 'thursday';
      } else if (dayOfWeek === 5) { // Friday
        return 'friday';
      } else if (dayOfWeek === 6) { // Saturday
        return 'saturday';
      }
    }
    
    // Default to Thursday for all users
    return 'thursday';
  }
}