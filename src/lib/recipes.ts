import fs from 'fs';
import path from 'path';
import { Recipe } from '@/types/recipe';

export async function getRecipes(): Promise<Recipe[]> {
  const recipesDirectory = path.join(process.cwd(), 'public', 'recipes');
  
  try {
    const files = await fs.promises.readdir(recipesDirectory);
    const pdfFiles = files.filter(file => file.endsWith('.pdf'));
    
    const recipes = pdfFiles.map((filename, index) => ({
      id: `recipe-${index + 1}`,
      name: filename
        .replace('.pdf', '')
        .replace(/-/g, ' ')
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      filename: filename,
      path: `/recipes/${filename}`
    }));

    // Sort recipes alphabetically
    recipes.sort((a, b) => a.name.localeCompare(b.name));
    
    return recipes;
  } catch (error) {
    console.error('Error reading recipes directory:', error);
    return [];
  }
}