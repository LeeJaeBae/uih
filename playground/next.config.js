/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['uih-parser', 'uih-codegen-react'],
  serverComponentsExternalPackages: ['chevrotain', 'prettier'],
  webpack: (config) => {
    // ESM 모듈 호환성 개선
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
    };
    return config;
  },
};

module.exports = nextConfig;
