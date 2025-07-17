import { Recipe } from '@/types/recipe';
import RecipeList from './components/RecipeList';
import { getRecipes } from '@/lib/recipes';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const recipes: Recipe[] = await getRecipes();

  return <RecipeList recipes={recipes} />;
}