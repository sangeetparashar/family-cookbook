/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    '/api/**': [
      '!src/lib/recipe-images.ts',
      '!src/lib/images-map.json'
    ]
  },
  // Exclude PDF files from the build bundle
  experimental: {
    outputFileTracingExcludes: {
      '*': [
        'public/recipes/**/*.pdf'
      ]
    }
  }
}

module.exports = nextConfig