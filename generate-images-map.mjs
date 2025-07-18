import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateImagesMap() {
  const recipesDirectory = path.join(__dirname, 'public', 'recipes');
  const imagesMap = {};

  try {
    const items = await fs.promises.readdir(recipesDirectory, { withFileTypes: true });
    
    // Get all directories (recipe folders)
    const recipeFolders = items
      .filter(item => item.isDirectory())
      .map(item => item.name);

    console.log(`Found ${recipeFolders.length} recipe folders`);

    for (const folderName of recipeFolders) {
      const recipeFolder = path.join(recipesDirectory, folderName);
      
      try {
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

        if (pngFiles.length > 0) {
          // Generate full paths for the images
          const imagePaths = pngFiles.map(file => `/recipes/${encodeURIComponent(folderName)}/${file}`);

          imagesMap[folderName] = {
            recipeName: folderName,
            totalImages: pngFiles.length,
            images: pngFiles,
            imagePaths
          };

          console.log(`  ${folderName}: ${pngFiles.length} images`);
        }
      } catch (error) {
        console.warn(`Error reading folder ${folderName}:`, error);
      }
    }

    // Write the JSON file
    const jsonOutputPath = path.join(__dirname, 'src', 'lib', 'images-map.json');
    await fs.promises.writeFile(jsonOutputPath, JSON.stringify(imagesMap, null, 2) + '\r\n');

    // Generate a much smaller TypeScript file that imports the JSON
    const tsContent = `// Auto-generated file - do not edit manually\r
import imagesMapData from './images-map.json';\r
\r
export interface RecipeImageData {\r
  recipeName: string;\r
  totalImages: number;\r
  images: string[];\r
  imagePaths: string[];\r
}\r
\r
// Function to get image data for a specific recipe\r
export function getRecipeImages(recipeName: string): RecipeImageData | null {\r
  return (imagesMapData as Record<string, RecipeImageData>)[recipeName] || null;\r
}\r
\r
// Function to get all recipe names that have images\r
export function getRecipeNamesWithImages(): string[] {\r
  return Object.keys(imagesMapData);\r
}\r
\r
// Function to check if a recipe has images\r
export function hasRecipeImages(recipeName: string): boolean {\r
  return recipeName in imagesMapData;\r
}\r
`;

    // Write the TypeScript file
    const tsOutputPath = path.join(__dirname, 'src', 'lib', 'recipe-images.ts');
    await fs.promises.writeFile(tsOutputPath, tsContent);
    
    console.log(`\nImages map generated successfully!`);
    console.log(`Total recipes with images: ${Object.keys(imagesMap).length}`);
    console.log(`JSON file: ${jsonOutputPath}`);
    console.log(`TypeScript file: ${tsOutputPath}`);

    return imagesMap;
  } catch (error) {
    console.error('Error generating images map:', error);
    return {};
  }
}

// Run the script
generateImagesMap().catch(console.error); 