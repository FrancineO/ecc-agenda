import { NextRequest, NextResponse } from 'next/server';
import { userDbService } from '../../../../services/UserDatabaseService';

// Force this route to be dynamic
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { input } = await request.json();
    
    if (!input) {
      return NextResponse.json(
        { error: 'Email or Pega ID is required' },
        { status: 400 }
      );
    }

    // Try to find user using MongoDB (with JSON fallback)
    const user = await userDbService.findUser(input.trim());
    
    if (user) {
      return NextResponse.json({ 
        user,
        source: await userDbService.isConnected() ? 'mongodb' : 'json'
      });
    } else {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('User lookup error:', error);
    return NextResponse.json(
      { error: 'An error occurred while looking up the user' },
      { status: 500 }
    );
  }
}