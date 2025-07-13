/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config: { resolve: { alias: { canvas: boolean; }; }; }) => {
    config.resolve.alias.canvas = false;
    return config;
  },
}

export default nextConfig;