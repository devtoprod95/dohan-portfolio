import type { NextConfig } from "next";

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.PWA_READY !== 'true',
  register: true,
  skipWaiting: true,
});

const isProd     = process.env.NODE_ENV  === 'production';
const prefix     = isProd ? '/dohan-portfolio' : '';
const isPwaReady = process.env.PWA_READY === 'true';

const nextConfig: NextConfig = {
  output: 'export',
  allowedDevOrigins: ['192.168.0.63'],
  trailingSlash: true, 
  basePath: prefix,
  // 수정 포인트: assetPrefix 뒤에 슬래시를 빼고 prefix만 전달하거나 
  // 배포 시에는 prefix를 명확히 인지하도록 세팅합니다.
  assetPrefix: isProd ? `${prefix}` : '', 
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_PREFIX: prefix,
    PWA_READY: String(isPwaReady),
  },
};

export default (process.env.PWA_READY === 'true' || isProd)
  ? withPWA(nextConfig)
  : nextConfig;