import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Handle GLB and GLTF files
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      type: 'asset/resource',
    });
    return config;
  },
  // Add headers for GLB files
  async headers() {
    return [
      {
        source: '/(.*).glb',
        headers: [
          {
            key: 'Content-Type',
            value: 'model/gltf-binary',
          },
        ],
      },
      {
        source: '/(.*).gltf',
        headers: [
          {
            key: 'Content-Type',
            value: 'model/gltf+json',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
