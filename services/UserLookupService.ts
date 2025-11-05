import { userDbService, User } from './UserDatabaseService';
import usersData from '../data/users.json';

export class UserLookupService {
  private static isInitialized = false;

  /**
   * Initialize the database with data from JSON file if needed
   */
  private static async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      // Check if users exist in database
      const existingUsers = await userDbService.getAllUsers();
      
      // If no users exist, migrate from JSON
      if (existingUsers.length === 0) {
        console.log('No users found in database. Migrating from JSON...');
        await userDbService.migrateFromJson(usersData.users);
      }
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize UserLookupService:', error);
      // Fall back to using JSON data directly
      this.isInitialized = false;
    }
  }

  /**
   * Find a user by their email address or Pega ID
   * @param input - Email address or Pega ID
   * @returns User object if found, null otherwise
   */
  static async findUser(input: string): Promise<User | null> {
    if (!input) return null;
    
    try {
      await this.initialize();
      return await userDbService.findUser(input);
    } catch (error) {
      console.error('Database error, falling back to JSON:', error);
      // Fallback to JSON data
      return this.findUserFromJson(input);
    }
  }

  /**
   * Fallback method to find user from JSON data
   */
  private static findUserFromJson(input: string): User | null {
    if (!input) return null;
    
    const normalizedInput = input.toLowerCase().trim();
    
    // Try to find by email first
    const userByEmail = usersData.users.find(user => 
      user.email.toLowerCase() === normalizedInput
    );
    
    if (userByEmail) return userByEmail;
    
    // Try to find by Pega ID (case insensitive)  
    const userByPegaId = usersData.users.find(user => 
      user.pegaId.toLowerCase() === normalizedInput
    );
    
    return userByPegaId || null;
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