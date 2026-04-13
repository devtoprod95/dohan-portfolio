import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: isProd ? '/dohan-portfolio' : '', 
  assetPrefix: isProd ? '/dohan-portfolio/' : '',
};

export default nextConfig;