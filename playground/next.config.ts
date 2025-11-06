import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // UIH 패키지를 브라우저에서 사용할 수 있도록 설정
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };
    return config;
  },
};

export default nextConfig;
