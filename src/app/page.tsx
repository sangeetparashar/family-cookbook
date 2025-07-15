import { Recipe } from '@/types/recipe';
import RecipeList from './components/RecipeList';
import { getRecipes } from '@/lib/recipes';

export const dynamic = 'force-dynamic'; // Ensure fresh data

export default async function Home() {
  const recipes: Recipe[] = await getRecipes();

  return (
    <>
      {recipes.length === 0 ? (
        <main className="min-h-screen bg-gray-100">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-12">
              <p className="text-gray-500">
                No recipes found. Add PDF files to the /public/recipes directory.
              </p>
            </div>
          </div>
        </main>
      ) : (
        <RecipeList recipes={recipes} />
      )}
    </>
  );
}