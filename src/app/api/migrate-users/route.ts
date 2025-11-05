import { NextResponse } from 'next/server';
import { userDbService } from '../../../../services/UserDatabaseService';
import usersData from '../../../../data/users.json';

// Force this route to be dynamic
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    // Check if data already exists
    const isConnected = await userDbService.isConnected();
    
    if (isConnected) {
      return NextResponse.json({
        success: false,
        message: 'Users already exist in MongoDB. Migration skipped.',
        userCount: await (await userDbService.getAllUsers()).length
      });
    }

    // Migrate data from JSON to MongoDB
    const success = await userDbService.migrateFromJson(usersData.users);
    
    if (success) {
      const userCount = await (await userDbService.getAllUsers()).length;
      return NextResponse.json({
        success: true,
        message: `Successfully migrated ${userCount} users to MongoDB`,
        userCount
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Migration failed' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { success: false, message: 'Migration failed', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const isConnected = await userDbService.isConnected();
    const users = await userDbService.getAllUsers();
    
    return NextResponse.json({
      mongodb_connected: isConnected,
      user_count: users.length,
      source: isConnected ? 'mongodb' : 'json',
      message: isConnected ? 'MongoDB is connected and has data' : 'Using JSON fallback data'
    });
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { 
        mongodb_connected: false, 
        user_count: usersData.users.length,
        source: 'json',
        message: 'MongoDB connection failed, using JSON fallback',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 200 } // Don't return error status, just show the fallback is working
    );
  }
}