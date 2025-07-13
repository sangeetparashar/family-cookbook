'use client';

import { useState } from 'react';
import { Recipe } from '@/types/recipe';
import dynamic from 'next/dynamic';

const PDFViewer = dynamic(() => import('./PDFViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  ),
});

interface RecipeAccordionProps {
  recipe: Recipe;
}

export default function RecipeAccordion({ recipe }: RecipeAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);

  const toggleAccordion = () => {
    if (!hasBeenOpened && !isOpen) {
      setHasBeenOpened(true);
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={toggleAccordion}
        className="w-full px-4 md:px-6 py-3 md:py-4 bg-white hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-expanded={isOpen}
        aria-controls={`recipe-content-${recipe.id}`}
      >
        <h3 className="text-base md:text-lg font-semibold text-gray-800 text-left pr-2">
          {recipe.name}
        </h3>
        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          <a
            href={recipe.path}
            download={recipe.filename}
            onClick={(e) => e.stopPropagation()}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors"
            aria-label={`Download ${recipe.name}`}
          >
            Download
          </a>
          <svg
            className={`w-5 h-5 md:w-6 md:h-6 text-gray-600 transform transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>
      
      {isOpen && (
        <div 
          id={`recipe-content-${recipe.id}`}
          className="px-4 md:px-6 py-4 bg-gray-50 border-t border-gray-200"
        >
          <div className="max-w-full overflow-x-auto">
            {hasBeenOpened && <PDFViewer url={recipe.path} className="w-full" />}
          </div>
        </div>
      )}
    </div>
  );
}