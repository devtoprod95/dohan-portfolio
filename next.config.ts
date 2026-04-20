import type { NextConfig } from "next";

// next-pwa는 아직 CJS 방식을 사용하므로 require로 불러옵니다.
const withPWA = require('next-pwa')({
  dest: 'public',
  // PWA_READY가 true가 아닐 때는 PWA 기능을 비활성화합니다.
  disable: process.env.PWA_READY !== 'true',
  register: true,
  skipWaiting: true,
});

const isProd = process.env.NODE_ENV === 'production';
const prefix = isProd ? '/dohan-portfolio' : '';

const nextConfig: NextConfig = {
  output: 'export',
  // PWA의 'basePath' 인식을 돕기 위해 trailingSlash를 true로 권장합니다.
  allowedDevOrigins: ['192.168.0.63'],
  trailingSlash: true, 
  basePath: prefix,
  assetPrefix: isProd ? `${prefix}/` : '',
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_PREFIX: prefix,
  },
};

// PWA_READY 환경변수가 true이거나 운영 빌드(isProd)일 때만 withPWA를 적용합니다.
export default (process.env.PWA_READY === 'true' || isProd)
  ? withPWA(nextConfig)
  : nextConfig;