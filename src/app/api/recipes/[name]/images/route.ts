import { NextRequest, NextResponse } from 'next/server';
import { getRecipeImages } from '@/lib/recipe-images';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const recipeName = decodeURIComponent(name);
    
    // Get image data from static map
    const imageData = getRecipeImages(recipeName);
    
    if (!imageData) {
      return NextResponse.json({ 
        error: 'No images found for this recipe',
        recipeName
      }, { status: 404 });
    }

    return NextResponse.json(imageData);

  } catch (error) {
    console.error('Error getting recipe images:', error);
    return NextResponse.json(
      { error: 'Failed to get recipe images' },
      { status: 500 }
    );
  }
} 