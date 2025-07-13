'use client';

import { useState, useCallback, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Using CDN for PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  url: string;
  className?: string;
}

export default function PDFViewer({ url, className = '' }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageWidth, setPageWidth] = useState<number>(600);

  // Calculate page width based on container
  const calculatePageWidth = useCallback(() => {
    const container = document.querySelector('.pdf-container');
    if (container) {
      const containerWidth = container.clientWidth;
      setPageWidth(Math.min(containerWidth - 32, 800));
    }
  }, []);

  useEffect(() => {
    calculatePageWidth();
    window.addEventListener('resize', calculatePageWidth);
    return () => window.removeEventListener('resize', calculatePageWidth);
  }, [calculatePageWidth]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
    setPageNumber(1);
  }

  function onDocumentLoadError(error: Error) {
    setError(error.message);
    setLoading(false);
  }

  return (
    <div className={`pdf-viewer ${className}`}>
      {loading && (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">Error loading PDF: {error}</span>
        </div>
      )}

      <div className="pdf-container">
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={null}
          className="flex flex-col items-center"
        >
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <Page 
              pageNumber={pageNumber} 
              width={pageWidth}
              loading={null}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </div>
        </Document>
      </div>

      {numPages && numPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
          <button
            onClick={() => setPageNumber(prev => Math.max(1, prev - 1))}
            disabled={pageNumber <= 1}
            className="px-3 py-1.5 md:px-4 md:py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors text-sm md:text-base"
          >
            Previous
          </button>
          
          <p className="text-sm text-gray-600">
            Page {pageNumber} of {numPages}
          </p>
          
          <button
            onClick={() => setPageNumber(prev => Math.min(numPages, prev + 1))}
            disabled={pageNumber >= numPages}
            className="px-3 py-1.5 md:px-4 md:py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors text-sm md:text-base"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}