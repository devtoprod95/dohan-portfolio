import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  allowedDevOrigins: ['192.168.0.63'],
  trailingSlash: false, // URL 끝에 /를 붙여서 경로를 더 명확히 함
  basePath: isProd ? '/dohan-portfolio' : '',
  assetPrefix: isProd ? '/dohan-portfolio/' : '',
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_PREFIX: isProd ? '/dohan-portfolio' : '',
  },
};

export default nextConfig;