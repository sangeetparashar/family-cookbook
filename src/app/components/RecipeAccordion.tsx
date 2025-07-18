'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { Recipe } from '@/types/recipe';
import { ChevronDown, ChevronUp, BookOpen, Download, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface RecipeAccordionProps {
  recipe: Recipe;
  isOpen: boolean;
  onToggle: () => void;
}

interface RecipeImageData {
  recipeName: string;
  totalImages: number;
  images: string[];
  imagePaths: string[];
}

// Global cache for images data
let imagesDataCache: Record<string, RecipeImageData> | null = null;
let imagesDataPromise: Promise<Record<string, RecipeImageData>> | null = null;

async function fetchImagesData(): Promise<Record<string, RecipeImageData>> {
  if (imagesDataCache) {
    return imagesDataCache;
  }
  
  if (imagesDataPromise) {
    return imagesDataPromise;
  }

  imagesDataPromise = fetch('/api/recipes/images')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch images data');
      }
      return response.json();
    })
    .then(data => {
      imagesDataCache = data;
      return data;
    });

  return imagesDataPromise;
}

// Image Modal Component
interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageData: RecipeImageData;
  currentIndex: number;
  onIndexChange: (index: number) => void;
  recipeName: string;
}

function ImageModal({ isOpen, onClose, imageData, currentIndex, onIndexChange, recipeName }: ImageModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (event.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (currentIndex > 0) {
            onIndexChange(currentIndex - 1);
          }
          break;
        case 'ArrowRight':
          if (currentIndex < imageData.totalImages - 1) {
            onIndexChange(currentIndex + 1);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, imageData.totalImages, onIndexChange, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-75 backdrop-blur-sm" />
      
      {/* Modal Content */}
      <div 
        ref={modalRef}
        className="relative w-full h-full flex items-center justify-center p-4"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-gray-800 text-white p-3 rounded-full hover:bg-gray-900 transition-all duration-200 shadow-lg border-2 border-white"
          aria-label="Close modal"
        >
          <X size={28} />
        </button>

        {/* Main Image */}
        <div className="relative max-w-full max-h-full bg-white rounded-lg shadow-lg">
          <Image
            src={imageData.imagePaths[currentIndex]}
            alt={`${recipeName} - Page ${currentIndex + 1}`}
            width={1200}
            height={1600}
            className="max-w-full max-h-[90vh] object-contain"
            sizes="(max-width: 768px) 95vw, (max-width: 1200px) 80vw, 70vw"
            priority
          />
        </div>

        {/* Navigation Controls */}
        {imageData.totalImages > 1 && (
          <>
            {/* Previous Button */}
            {currentIndex > 0 && (
              <button
                onClick={() => onIndexChange(currentIndex - 1)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all duration-200 z-10"
                aria-label="Previous page"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {/* Next Button */}
            {currentIndex < imageData.totalImages - 1 && (
              <button
                onClick={() => onIndexChange(currentIndex + 1)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all duration-200 z-10"
                aria-label="Next page"
              >
                <ChevronRight size={24} />
              </button>
            )}

            {/* Page Indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-sm z-10">
              {currentIndex + 1} / {imageData.totalImages}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function RecipeAccordion({ recipe, isOpen, onToggle }: RecipeAccordionProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageData, setImageData] = useState<RecipeImageData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch image data for the recipe
  useEffect(() => {
    if (isOpen && recipe.name) {
      setLoading(true);
      setError(null);
      
      const fetchImages = async () => {
        try {
          const allImagesData = await fetchImagesData();
          const recipeImages = allImagesData[recipe.name];
          
          if (!recipeImages) {
            setError('No images found for this recipe');
            return;
          }
          
          setImageData(recipeImages);
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

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
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
                  {/* Main Image Display - Clickable to open modal */}
                  <div className="relative w-full cursor-pointer" onClick={openModal}>
                    <Image
                      src={imageData.imagePaths[currentImageIndex]}
                      alt={`${recipe.name} - Page ${currentImageIndex + 1}`}
                      width={800}
                      height={1200}
                      className="w-full h-auto object-contain bg-white hover:opacity-90 transition-opacity duration-200"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                      priority={currentImageIndex === 0}
                    />
                    {/* Click indicator overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                      <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm opacity-0 hover:opacity-100 transition-opacity duration-200">
                        Click to enlarge
                      </div>
                    </div>
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

      {/* Image Modal */}
      {imageData && (
        <ImageModal
          isOpen={isModalOpen}
          onClose={closeModal}
          imageData={imageData}
          currentIndex={currentImageIndex}
          onIndexChange={setCurrentImageIndex}
          recipeName={recipe.name}
        />
      )}
    </>
  );
}