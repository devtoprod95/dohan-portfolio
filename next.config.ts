import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true, // URL 끝에 /를 붙여서 경로를 더 명확히 함
  basePath: isProd ? '/dohan-portfolio' : '',
  assetPrefix: isProd ? '/dohan-portfolio/' : '',
  images: { unoptimized: true },
};

export default nextConfig;