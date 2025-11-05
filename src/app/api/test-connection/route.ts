import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

// Force this route to be dynamic
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('Testing MongoDB connection...');
    console.log('MONGODB_URI:', process.env.MONGODB_URI?.substring(0, 50) + '...');
    
    const client = await clientPromise;
    console.log('Client connected successfully');
    
    const db = client.db('pega-ecc-2025');
    console.log('Database selected: pega-ecc-2025');
    
    const adminDb = client.db().admin();
    const result = await adminDb.ping();
    console.log('Ping result:', result);
    
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful',
      ping: result,
      collections: collections.map(c => c.name),
      database: 'pega-ecc-2025'
    });
  } catch (error) {
    console.error('MongoDB connection test failed:', error);
    
    return NextResponse.json({
      success: false,
      message: 'MongoDB connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}