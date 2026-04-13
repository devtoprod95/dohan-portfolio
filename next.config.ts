import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* 빌드 시 정적 HTML 파일들을 생성하도록 설정 (GitHub Pages 필수) */
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/dohan-portfolio',
};

export default nextConfig;