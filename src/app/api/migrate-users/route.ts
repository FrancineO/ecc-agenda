import { NextResponse } from 'next/server';
import { userDbService } from '../../../../services/UserDatabaseService';

// Force this route to be dynamic
export const dynamic = 'force-dynamic';


export async function GET() {
  try {
    const isConnected = await userDbService.isConnected();
    const users = await userDbService.getAllUsers();
    
    return NextResponse.json({
      mongodb_connected: isConnected,
      user_count: users.length,
      source: 'mongodb',
      message: isConnected ? 'MongoDB is connected and has data' : 'MongoDB connection failed'
    });
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { 
        mongodb_connected: false, 
        user_count: 0,
        source: 'none',
        message: 'MongoDB connection failed - no fallback available',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 } // Service Unavailable
    );
  }
}