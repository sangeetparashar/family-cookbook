declare module "*.json" {
  const value: Record<string, {
    recipeName: string;
    totalImages: number;
    images: string[];
    imagePaths: string[];
  }>;
  export default value;
} 