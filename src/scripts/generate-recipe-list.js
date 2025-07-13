import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const recipesDir = join(process.cwd(), 'public', 'recipes');
const outputPath = join(process.cwd(), 'src', 'data', 'recipes.json');

// Ensure the data directory exists
const dataDir = join(process.cwd(), 'src', 'data');
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

try {
  const files = readdirSync(recipesDir);
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

  writeFileSync(outputPath, JSON.stringify(recipes, null, 2));
  console.log(`Generated recipes list with ${recipes.length} PDFs`);
} catch (error) {
  console.error('Error generating recipes list:', error);
  // Create empty file if error
  writeFileSync(outputPath, '[]');
}