'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { Recipe } from '@/types/recipe';
import { ChevronDown, ChevronUp, BookOpen, Download, ChevronLeft, ChevronRight } from 'lucide-react';

interface RecipeAccordionProps {
  recipe: Recipe;
  isOpen: boolean;
  onToggle: () => void;
}

interface ImageData {
  recipeName: string;
  totalImages: number;
  images: string[];
  imagePaths: string[];
}

export default function RecipeAccordion({ recipe, isOpen, onToggle }: RecipeAccordionProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch image data for the recipe
  useEffect(() => {
    if (isOpen && recipe.name) {
      setLoading(true);
      setError(null);
      
      const fetchImages = async () => {
        try {
          const response = await fetch(`/api/recipes/${encodeURIComponent(recipe.name)}/images`);
          
          if (!response.ok) {
            if (response.status === 404) {
              setError('No images found for this recipe');
            } else {
              setError('Failed to load recipe images');
            }
            return;
          }
          
          const data: ImageData = await response.json();
          setImageData(data);
          setCurrentImageIndex(0);
        } catch (err) {
          console.error('Error fetching images:', err);
          setError('Failed to load recipe images');
        } finally {
          setLoading(false);
        }
      };

      fetchImages();
    }
  }, [isOpen, recipe.name]);

  const nextImage = () => {
    if (imageData && currentImageIndex < imageData.totalImages - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  };

  return (
    <div className={`border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col ${isOpen ? 'flex-none' : 'flex-1 min-h-0 max-h-[7vh]'}`}>
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`recipe-content-${recipe.id}`}
        className={`w-full flex items-center justify-between p-4 md:p-5 text-left bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-colors duration-150 ${isOpen ? 'flex-shrink-0' : 'flex-1'}`}
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
        className={`overflow-hidden transition-all duration-700 ease-in-out flex-shrink-0 ${
          isOpen ? 'max-h-none opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4 md:p-6 bg-white border-t border-gray-200">
          <p className="text-sm text-gray-600 italic mb-4">{recipe.description}</p>
          
          {/* Categories and Download Button Row */}
          <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
            {/* Categories on the left */}
            <div className="flex-1">
              <span className="font-semibold text-sm text-gray-700 mr-2">Categories:</span>
              {recipe.category.map((cat, index) => (
                <span key={index} className="text-sm text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full mr-2 mb-1 inline-block border border-indigo-200">
                  {cat}
                </span>
              ))}
            </div>
            
            {/* Download PDF Button on the right */}
            <div className="flex-shrink-0 ml-4">
              <a
                href={recipe.path}
                download={recipe.path}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-green-500 rounded-lg shadow-sm text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 hover:shadow-md"
                title="Download Recipe PDF"
              >
                <Download size={16} className="mr-2" />
                Download PDF
              </a>
            </div>
          </div>

          {/* Image Gallery Area */}
          <div className="mt-6 border rounded-md overflow-hidden bg-gray-50">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
                <p className="text-sm">Loading recipe images...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                <BookOpen size={48} className="mb-4 text-gray-300" />
                <p className="text-lg font-semibold mb-2">No Images Available</p>
                <p className="text-sm">{error}</p>
              </div>
            ) : imageData && imageData.totalImages > 0 ? (
              <div className="relative">
                {/* Main Image Display */}
                <div className="relative w-full">
                  <Image
                    src={imageData.imagePaths[currentImageIndex]}
                    alt={`${recipe.name} - Page ${currentImageIndex + 1}`}
                    width={800}
                    height={1200}
                    className="w-full h-auto object-contain bg-white"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                    priority={currentImageIndex === 0}
                  />
                </div>

                {/* Navigation Controls */}
                {imageData.totalImages > 1 && (
                  <>
                    {/* Previous Button */}
                    {currentImageIndex > 0 && (
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all duration-200 z-10"
                        aria-label="Previous page"
                      >
                        <ChevronLeft size={20} />
                      </button>
                    )}

                    {/* Next Button */}
                    {currentImageIndex < imageData.totalImages - 1 && (
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all duration-200 z-10"
                        aria-label="Next page"
                      >
                        <ChevronRight size={20} />
                      </button>
                    )}

                    {/* Page Indicator */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm z-10">
                      {currentImageIndex + 1} / {imageData.totalImages}
                    </div>
                  </>
                )}

                {/* Thumbnail Navigation */}
                {imageData.totalImages > 1 && (
                  <div className="p-4 bg-white border-t">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {imageData.imagePaths.map((imagePath, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-16 h-20 border-2 rounded overflow-hidden relative ${
                            currentImageIndex === index 
                              ? 'border-indigo-500' 
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <Image
                            src={imagePath}
                            alt={`Thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                <BookOpen size={48} className="mb-4 text-gray-300" />
                <p className="text-lg font-semibold mb-2">No Images Available</p>
                <p className="text-sm">Recipe images could not be loaded</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}