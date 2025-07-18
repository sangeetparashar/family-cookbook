import { NextResponse } from 'next/server';
import imagesMapData from '@/lib/images-map.json';

export async function GET() {
  try {
    return NextResponse.json(imagesMapData);
  } catch (error) {
    console.error('Error serving images data:', error);
    return NextResponse.json(
      { error: 'Failed to serve images data' },
      { status: 500 }
    );
  }
} 