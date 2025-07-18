import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const recipeName = decodeURIComponent(name);
    const recipeFolder = path.join(process.cwd(), 'public', 'recipes', recipeName);
    
    // Check if folder exists
    if (!fs.existsSync(recipeFolder)) {
      return NextResponse.json({ 
        error: 'Recipe folder not found',
        recipeName,
        folderPath: recipeFolder
      }, { status: 404 });
    }

    // Read all files in the folder
    const files = await fs.promises.readdir(recipeFolder);
    
    // Filter for PNG files and sort them
    const pngFiles = files
      .filter(file => file.toLowerCase().endsWith('.png'))
      .sort((a, b) => {
        // Extract page numbers and sort numerically
        const pageA = parseInt(a.match(/page-(\d+)\.png/)?.[1] || '0');
        const pageB = parseInt(b.match(/page-(\d+)\.png/)?.[1] || '0');
        return pageA - pageB;
      });

    // Generate full paths for the images
    const imagePaths = pngFiles.map(file => `/recipes/${encodeURIComponent(recipeName)}/${file}`);

    return NextResponse.json({
      recipeName,
      totalImages: pngFiles.length,
      images: pngFiles,
      imagePaths,
      folderPath: recipeFolder
    });

  } catch (error) {
    console.error('Error reading recipe images:', error);
    return NextResponse.json(
      { error: 'Failed to read recipe images' },
      { status: 500 }
    );
  }
} 