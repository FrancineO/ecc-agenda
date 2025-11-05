import clientPromise from '../lib/mongodb';
import { Db, Collection } from 'mongodb';
import { getBreakoutGroupRoute } from '../utils/breakoutGroupUtils';

export interface User {
  pegaId: string;
  email: string;
  breakoutGroup: string;
  regionalBreakout: string;
  preferredName: string;
  lastName: string;
}

interface MongoUser {
  "Pega ID": string;
  "Email": string;
  "Delivery Circle Breakout": number | string;
  "Regional Breakout": string;
  "Preferred Name": string;
  "Last Name": string;
}

export class UserDatabaseService {
  private db: Db | null = null;
  private users: Collection<MongoUser> | null = null;

  private async connect(): Promise<void> {
    if (!this.db) {
      const client = await clientPromise;
      this.db = client.db('userlist');
      if (this.db) {
        this.users = this.db.collection<MongoUser>('attendees');
      }
    }
  }

  private getBreakoutGroup(deliveryCircle: number | string): string {
    if (!deliveryCircle) return 'management';
    
    const circleStr = String(deliveryCircle).toLowerCase();
    
    // Use the utility function for consistent mapping
    const routeKey = getBreakoutGroupRoute(circleStr);
    if (routeKey !== 'management') return routeKey;
    
    // Handle numeric values - map to proper delivery circles
    const circle = typeof deliveryCircle === 'string' ? parseInt(deliveryCircle) : deliveryCircle;
    if (!isNaN(circle)) {
      switch (circle) {
        case 1: return 'delivery-circle-1';  // Slavia
        case 2: return 'delivery-circle-2';  // Sparta
        case 3: return 'delivery-circle-3';  // Viktoria
        default: return 'management';
      }
    }
    
    // Default fallback
    return 'management';
  }

  async findUserByEmail(email: string): Promise<User | null> {
    try {
      await this.connect();
      if (!this.users) return null;

      // Query the collection directly - data is stored as individual documents
      const document = await this.users.findOne({
        "Email": { $regex: new RegExp(`^${email.trim()}$`, 'i') }
      });
      
      if (document) {
        // Transform the document to match our interface
        return {
          pegaId: document["Pega ID"] || '',
          email: document["Email"] || '',
          breakoutGroup: this.getBreakoutGroup(document["Delivery Circle Breakout"]),
          regionalBreakout: document["Regional Breakout"] || '',
          preferredName: document["Preferred Name"] || '',
          lastName: document["Last Name"] || ''
        };
      }
      
      return null;
    } catch (error) {
      console.error('Database error in findUserByEmail:', error);
      return null;
    }
  }

  async findUserByPegaId(pegaId: string): Promise<User | null> {
    try {
      await this.connect();
      if (!this.users) return null;

      // Query the collection directly - data is stored as individual documents
      const document = await this.users.findOne({
        "Pega ID": { $regex: new RegExp(`^${pegaId.trim()}$`, 'i') }
      });
      
      if (document) {
        // Transform the document to match our interface
        return {
          pegaId: document["Pega ID"] || '',
          email: document["Email"] || '',
          breakoutGroup: this.getBreakoutGroup(document["Delivery Circle Breakout"]),
          regionalBreakout: document["Regional Breakout"] || '',
          preferredName: document["Preferred Name"] || '',
          lastName: document["Last Name"] || ''
        };
      }
      
      return null;
    } catch (error) {
      console.error('Database error in findUserByPegaId:', error);
      return null;
    }
  }

  async findUser(emailOrPegaId: string): Promise<User | null> {
    try {
      await this.connect();
      if (!this.users) return null;

      const trimmedInput = emailOrPegaId.trim();
      
      // Query the collection directly - data is stored as individual documents
      const document = await this.users.findOne({
        $or: [
          { "Email": { $regex: new RegExp(`^${trimmedInput}$`, 'i') } },
          { "Pega ID": { $regex: new RegExp(`^${trimmedInput}$`, 'i') } }
        ]
      });
      
      if (document) {
        // Transform the document to match our interface
        return {
          pegaId: document["Pega ID"] || '',
          email: document["Email"] || '',
          breakoutGroup: this.getBreakoutGroup(document["Delivery Circle Breakout"]),
          regionalBreakout: document["Regional Breakout"] || '',
          preferredName: document["Preferred Name"] || '',
          lastName: document["Last Name"] || ''
        };
      }
      
      return null;
    } catch (error) {
      console.error('Database error in findUser:', error);
      return null;
    }
  }



  async createUser(userData: User): Promise<User | null> {
    try {
      await this.connect();
      if (!this.users) throw new Error('Database connection failed');

      const result = await this.users.insertOne(userData);
      return { ...userData, _id: result.insertedId } as User;
    } catch (error) {
      console.error('Database error in createUser:', error);
      return null;
    }
  }

  async updateUser(emailOrPegaId: string, updateData: Partial<User>): Promise<User | null> {
    try {
      await this.connect();
      if (!this.users) return null;

      const trimmedInput = emailOrPegaId.trim();
      
      const result = await this.users.findOneAndUpdate(
        {
          $or: [
            { email: { $regex: new RegExp(`^${trimmedInput}$`, 'i') } },
            { pegaId: { $regex: new RegExp(`^${trimmedInput}$`, 'i') } }
          ]
        },
        { $set: updateData },
        { returnDocument: 'after' }
      );
      
      return result;
    } catch (error) {
      console.error('Database error in updateUser:', error);
      return null;
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      await this.connect();
      if (!this.users) return [];

      const mongoUsers = await this.users.find({}).toArray();
      
      // Transform MongoDB documents to User interface
      return mongoUsers.map(doc => ({
        pegaId: doc["Pega ID"] || '',
        email: doc["Email"] || '',
        breakoutGroup: this.getBreakoutGroup(doc["Delivery Circle Breakout"]),
        regionalBreakout: doc["Regional Breakout"] || '',
        preferredName: doc["Preferred Name"] || '',
        lastName: doc["Last Name"] || ''
      }));
    } catch (error) {
      console.error('Database error in getAllUsers:', error);
      return [];
    }
  }


  // Check if MongoDB is connected and has data
  async isConnected(): Promise<boolean> {
    try {
      await this.connect();
      if (!this.users) return false;
      
      // Check if there are any documents in the collection
      const count = await this.users.countDocuments();
      return count > 0;
    } catch (error) {
      console.error('Connection check failed:', error);
      return false;
    }
  }
}

// Export a singleton instance
export const userDbService = new UserDatabaseService();