'use client';

import { useState, useMemo } from 'react';
import { Recipe } from '@/types/recipe';
import RecipeAccordion from './RecipeAccordion';
import { Utensils, BookOpen, Globe } from 'lucide-react';

interface RecipeListProps {
  recipes: Recipe[];
}

export default function RecipeList({ recipes }: RecipeListProps) {
  const [filter, setFilter] = useState('All');
  const [openRecipeId, setOpenRecipeId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleToggleRecipe = (recipeId: string) => {
    setOpenRecipeId(openRecipeId === recipeId ? null : recipeId);
  };

  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      const title = recipe.name || recipe.title || '';
      const matchesCategory = filter === 'All' || recipe.category === filter;
      const matchesSearch =
        searchTerm === '' ||
        title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (recipe.tags && recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
      return matchesCategory && matchesSearch;
    });
  }, [recipes, filter, searchTerm]);

  const FilterButton = ({ category, Icon }: { category: string; Icon?: React.ComponentType<{ size?: number; className?: string }> }) => (
    <button
      onClick={() => setFilter(category)}
      className={`flex items-center px-4 py-2 mr-2 mb-2 text-sm font-medium rounded-lg transition-all duration-150 ease-in-out
        ${filter === category
          ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400 ring-offset-1'
          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'}`}
    >
      {Icon && <Icon size={18} className="mr-2" />}
      {category === 'All' ? 'All Recipes' : category}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
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
                placeholder="Search recipes or tags..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 flex-1">
        <div className="mb-6 md:mb-8 p-4 bg-white rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Filter by Cuisine:</h2>
          <div className="flex flex-wrap items-center gap-2">
            <FilterButton category="All" Icon={Globe} />
            <FilterButton category="Western" Icon={Utensils} />
            <FilterButton category="Eastern" Icon={Utensils} />
          </div>
        </div>

        {filteredRecipes.length > 0 ? (
          <div>
            {filteredRecipes.map(recipe => (
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
            <p className="text-sm text-gray-500">Try adjusting your filters or search term.</p>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} The Choi Family. All recipes cherished.
          </p>
        </div>
      </footer>
    </div>
  );
}