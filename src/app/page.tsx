import { Recipe } from '@/types/recipe';
import RecipeList from './components/RecipeList';
import { getRecipes } from '@/lib/recipes';

export const dynamic = 'force-dynamic'; // Ensure fresh data

export default async function Home() {
  const recipes: Recipe[] = await getRecipes();

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Recipe Collection
          </h1>
          <p className="text-gray-600">
            Browse and view our collection of {recipes.length} recipes
          </p>
        </header>

        {recipes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No recipes found. Add PDF files to the /public/recipes directory.
            </p>
          </div>
        ) : (
          <RecipeList recipes={recipes} />
        )}
      </div>
    </main>
  );
}