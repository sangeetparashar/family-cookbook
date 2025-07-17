'use client';

import { useRef } from 'react';
import { Recipe } from '@/types/recipe';
import { ChevronDown, ChevronUp, BookOpen, Download } from 'lucide-react';


interface RecipeAccordionProps {
  recipe: Recipe;
  isOpen: boolean;
  onToggle: () => void;
}

export default function RecipeAccordion({ recipe, isOpen, onToggle }: RecipeAccordionProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  // Extract filename for download
  const getFilenameFromUrl = (url: string) => {
    try {
      const encodedUrl = url.replace(/ /g, '%20');
      const path = `https://github.com/sangeetparashar/family-cookbook/tree/main/public${encodedUrl}`;
      return path.substring(path.lastIndexOf('/') + 1) || `recipe-${recipe.id}.pdf`;
    } catch (e) {
      console.error(e);
      return `recipe-${recipe.id}.pdf`;
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg shadow-sm mb-3 overflow-hidden">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`recipe-content-${recipe.id}`}
        className="w-full flex items-center justify-between p-4 md:p-5 text-left bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-colors duration-150"
      >
        <div className="flex items-center">
          <BookOpen size={20} className="mr-3 text-indigo-600 flex-shrink-0" />
          <span className="font-semibold text-lg text-gray-800">{recipe.name}</span>
        </div>
        {isOpen ? <ChevronUp size={24} className="text-indigo-600 flex-shrink-0" /> : <ChevronDown size={24} className="text-gray-500 flex-shrink-0" />}
      </button>
      
      {/* Content wrapper for smooth transition */}
      <div
        ref={contentRef}
        id={`recipe-content-${recipe.id}`}
        style={{ maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : '0px' }}
        className="overflow-hidden transition-max-height duration-700 ease-in-out"
      >
        <div className="p-4 md:p-6 bg-white border-t border-gray-200">
          <p className="text-sm text-gray-600 italic mb-3">{recipe.description}</p>
          <div className="flex flex-wrap gap-2 mb-3">
            <div>
              <span className="font-semibold text-sm text-gray-700">Category: </span>
              <span className="text-sm text-indigo-700 bg-indigo-100 px-2 py-1 rounded-full">{recipe.category}</span>
            </div>
            {/* Download PDF Button */}
            <a
              href={recipe.path}
              download={getFilenameFromUrl(recipe.path)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1 border border-green-400 rounded-md shadow-sm text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              title="Download Recipe PDF"
            >
              <Download size={16} className="mr-2" />
              Download PDF
            </a>
          </div>

          <div className="mb-4">
            <span className="font-semibold text-sm text-gray-700">Tags: </span>
            {recipe.tags?.map(tag => (
              <span key={tag} className="text-xs text-gray-600 bg-gray-200 px-2 py-1 rounded-full mr-1 mb-1 inline-block">{tag}</span>
            ))}
          </div>
          
          {/* PDF Viewer Area */}
          <div className="mt-6 border rounded-md overflow-hidden">
            <div className="relative w-full" style={{paddingBottom: "141.42%" /* For A4-like aspect ratio (sqrt(2)) */}}> 
              {recipe.path && recipe.path !== 'https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf' ? (
                <iframe
                  src={recipe.path}
                  title={recipe.name}
                  className="absolute top-0 left-0 w-full h-full"
                  allow="fullscreen"
                />
              ) : (
                <div className="absolute top-0 left-0 w-full h-full bg-gray-100 flex flex-col items-center justify-center p-4 rounded-md">
                  <p className="text-gray-700 font-semibold mb-2">Unavailable</p>
                  <p className="text-sm text-gray-500 mb-1 text-center">This is a placeholder. Replace with your actual PDF URL in the code.</p>
                  <p className="text-xs text-gray-400 mt-2">(Using dummy PDF link for demonstration)</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}