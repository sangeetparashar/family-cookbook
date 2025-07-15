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
          <div className="flex flex-wrap gap-2 mb-3">
            {/* Download PDF Button */}
            <a
              href={recipe.path}
              download={recipe.filename}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1 border border-green-400 rounded-md shadow-sm text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              title="Download Recipe PDF"
            >
              <Download size={16} className="mr-2" />
              Download PDF
            </a>
          </div>
          
          {/* PDF Viewer Area */}
          <div className="mt-6 border rounded-md overflow-hidden">
            <div className="relative w-full" style={{paddingBottom: "141.42%" /* For A4-like aspect ratio (sqrt(2)) */}}> 
              <iframe
                src={recipe.path}
                title={recipe.name}
                className="absolute top-0 left-0 w-full h-full"
                allow="fullscreen"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}