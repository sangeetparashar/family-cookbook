// Auto-generated file - do not edit manually
import imagesMapData from './images-map.json';

export interface RecipeImageData {
  recipeName: string;
  totalImages: number;
  images: string[];
  imagePaths: string[];
}

// Function to get image data for a specific recipe
export function getRecipeImages(recipeName: string): RecipeImageData | null {
  return (imagesMapData as Record<string, RecipeImageData>)[recipeName] || null;
}

// Function to get all recipe names that have images
export function getRecipeNamesWithImages(): string[] {
  return Object.keys(imagesMapData);
}

// Function to check if a recipe has images
export function hasRecipeImages(recipeName: string): boolean {
  return recipeName in imagesMapData;
}
