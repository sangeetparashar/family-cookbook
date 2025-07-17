"use client";

import { useState, useMemo } from "react";
import { Recipe } from "@/types/recipe";
import RecipeAccordion from "./RecipeAccordion";
import {
  Utensils,
  BookOpen,
  Globe,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface RecipeListProps {
  recipes: Recipe[];
}

export default function RecipeList({ recipes }: RecipeListProps) {
  const [filter, setFilter] = useState("All");
  const [openRecipeId, setOpenRecipeId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 15;

  const handleToggleRecipe = (recipeId: string) => {
    setOpenRecipeId(openRecipeId === recipeId ? null : recipeId);
  };

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const title = recipe.name || recipe.title || "";
      const matchesCategory = filter === "All" || recipe.category.includes(filter);
      const matchesSearch =
        searchTerm === "" ||
        title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (recipe.tags &&
          recipe.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          ));
      return matchesCategory && matchesSearch;
    });
  }, [recipes, filter, searchTerm]);

  // Reset to first page when filters change
  const resetPagination = () => {
    setCurrentPage(1);
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);
  const startIndex = (currentPage - 1) * recipesPerPage;
  const endIndex = startIndex + recipesPerPage;
  const currentRecipes = filteredRecipes.slice(startIndex, endIndex);

  // Handle filter changes
  const handleFilterChange = (category: string) => {
    setFilter(category);
    resetPagination();
  };

  // Handle search changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    resetPagination();
  };

  const FilterButton = ({
    category,
    Icon,
  }: {
    category: string;
    Icon?: React.ComponentType<{ size?: number; className?: string }>;
  }) => (
    <button
      onClick={() => handleFilterChange(category)}
      className={`flex items-center px-6 py-3 mr-3 mb-3 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out shadow-sm
        ${
          filter === category
            ? "bg-purple-600 text-white shadow-md ring-2 ring-purple-400 ring-offset-1"
            : "bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-200"
        }`}
    >
      {Icon && <Icon size={18} className="mr-2" />}
      {category === "All" ? "All Recipes" : category}
    </button>
  );

  const PaginationControls = () => {
    if (totalPages <= 1) return null;

    const goToPage = (page: number) => {
      setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    const renderPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;
      let startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2)
      );
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => goToPage(i)}
            className={`px-3 py-2 mx-1 text-sm font-medium rounded-md transition-colors
              ${
                currentPage === i
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
              }`}
          >
            {i}
          </button>
        );
      }
      return pages;
    };

    return (
      <div className="flex items-center justify-center space-x-2 mt-6">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} className="mr-1" />
          Previous
        </button>

        {renderPageNumbers()}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen   flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Desktop Layout - Title centered, search on right */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex-1"></div> {/* Spacer for centering */}
            <div className="flex items-center text-2xl lg:text-3xl font-bold text-indigo-700">
              <Utensils size={36} className="mr-3 text-indigo-500 flex-shrink-0" />
              The Choi Cookbook
            </div>
            <div className="flex-1 flex justify-end">
              <div className="w-80">
                <input 
                    type="text"
                    placeholder="Search recipes or tags..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm"
                />
              </div>
            </div>
          </div>
          
          {/* Mobile Layout - Stacked vertically */}
          <div className="md:hidden flex flex-col items-center gap-4">
            <div className="flex items-center text-2xl font-bold text-indigo-700">
              <Utensils size={32} className="mr-3 text-indigo-500 flex-shrink-0" />
              The Choi Cookbook
            </div>
            <div className="w-full max-w-sm">
              <input 
                  type="text"
                  placeholder="Search recipes or tags..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex-1 flex flex-col">
        <div className="mb-4 p-6 bg-purple-50 rounded-xl shadow-md flex-shrink-0 border border-purple-100">
          <h2 className="text-xl font-semibold text-purple-800 mb-4">
            Filter by Cuisine:
          </h2>
          <div className="flex flex-wrap items-center">
            <FilterButton category="All" Icon={Globe} />
            <FilterButton category="Dessert" Icon={Utensils} />
            <FilterButton category="Asian" Icon={Utensils} />
            <FilterButton category="Mexican" Icon={Utensils} />
            <FilterButton category="Western" Icon={Utensils} />
            <FilterButton category="Salad&Sides" Icon={Utensils} />
          </div>
        </div>

        {currentRecipes.length > 0 ? (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 flex flex-col gap-2">
              {currentRecipes.map((recipe) => (
                <RecipeAccordion
                  key={recipe.id}
                  recipe={recipe}
                  isOpen={openRecipeId === recipe.id}
                  onToggle={() => handleToggleRecipe(recipe.id)}
                />
              ))}
            </div>

            <div className="flex-shrink-0 mt-6">
              <PaginationControls />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center py-12 bg-white rounded-xl shadow-md p-6">
              <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-xl text-gray-600">
                No recipes found matching your criteria.
              </p>
              <p className="text-sm text-gray-500">
                Try adjusting your filters or search term.
              </p>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 flex-shrink-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} The Choi Family. All recipes
            cherished.
          </p>
        </div>
      </footer>
    </div>
  );
}
