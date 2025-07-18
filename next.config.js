/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    '/api/**': [
      '!src/lib/recipe-images.ts',
      '!src/lib/images-map.json'
    ]
  }
}

module.exports = nextConfig