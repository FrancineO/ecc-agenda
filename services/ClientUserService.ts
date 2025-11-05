export interface User {
  pegaId: string;
  email: string;
  breakoutGroup: string;
  regionalBreakout: string;
  preferredName: string;
  lastName: string;
}

export class ClientUserService {
  /**
   * Find a user by their email address or Pega ID using the API
   * @param input - Email address or Pega ID
   * @returns User object if found, null otherwise
   */
  static async findUser(input: string): Promise<User | null> {
    if (!input) return null;
    
    try {
      const response = await fetch('/api/user-lookup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: input.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.user;
      } else if (response.status === 404) {
        return null; // User not found
      } else {
        throw new Error(`API error: ${response.status}`);
      }
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
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