export interface Recipe {
    id: string;
    name: string;
    description: string;
    category: string;
    tags?: string[];
    path: string;
    // Add these for compatibility with sample UI
    title?: string;
    pdfUrl?: string;
}