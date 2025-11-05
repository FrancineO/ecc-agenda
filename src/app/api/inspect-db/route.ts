import { NextResponse } from 'next/server';
import { userDbService } from '../../../../services/UserDatabaseService';
import clientPromise from '../../../../lib/mongodb';

// Force this route to be dynamic
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Connect directly to inspect the database
    const client = await clientPromise;
    const db = client.db('userlist');
    const collection = db.collection('attendees');
    
    // Get basic info about the collection
    const count = await collection.countDocuments();
    const sampleUsers = await collection.find({}).limit(5).toArray();
    
    // Test if our service can find users
    const serviceConnected = await userDbService.isConnected();
    const allUsersFromService = await userDbService.getAllUsers();
    
    return NextResponse.json({
      database: 'userlist',
      collection: 'attendees',
      totalDocuments: count,
      sampleUsers: sampleUsers,
      serviceConnected: serviceConnected,
      serviceUserCount: allUsersFromService.length,
      firstUserFromService: allUsersFromService[0] || null
    });
    
  } catch (error) {
    console.error('Database inspection error:', error);
    return NextResponse.json({
      error: 'Failed to inspect database',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}