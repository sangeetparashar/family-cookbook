'use client';

import { useState, useMemo } from 'react';
import { Recipe } from '@/types/recipe';
import RecipeAccordion from './RecipeAccordion';
import { Utensils, BookOpen } from 'lucide-react';

interface RecipeListProps {
  recipes: Recipe[];
}

export default function RecipeList({ recipes }: RecipeListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [openRecipeId, setOpenRecipeId] = useState<string | null>(null);

  const handleToggleRecipe = (recipeId: string) => {
    setOpenRecipeId(openRecipeId === recipeId ? null : recipeId);
  };

  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => 
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [recipes, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center text-2xl sm:text-3xl font-bold text-indigo-700">
              <Utensils size={36} className="mr-3 text-indigo-500 flex-shrink-0" />
              Our Family Cookbook
            </div>
            <div className="w-full sm:w-auto max-w-xs sm:max-w-sm">
              <input 
                type="text"
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Results count */}
        <div className="mb-6 text-center text-gray-600">
          {filteredRecipes.length === 0 ? (
            <p>No recipes found matching your criteria.</p>
          ) : (
            <p>
              Showing {filteredRecipes.length} of {recipes.length} recipes
            </p>
          )}
        </div>

        {/* Recipe Grid */}
        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeAccordion 
                key={recipe.id} 
                recipe={recipe}
                isOpen={openRecipeId === recipe.id}
                onToggle={() => handleToggleRecipe(recipe.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-md p-6">
            <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-xl text-gray-600">No recipes found matching your criteria.</p>
            <p className="text-sm text-gray-500">Try adjusting your search term.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} The Family. All recipes cherished.
          </p>
        </div>
      </footer>
    </div>
  );
}