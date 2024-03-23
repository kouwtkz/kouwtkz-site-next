/** @type {import('next').NextConfig} */
const nextConfig = {};

const distDir = process.env.DIST_DIR;
const isBuild = process.env.NODE_ENV === 'production';
const outputMode = process.env.OUTPUT_MODE || null;
if (isBuild && outputMode === "export") {
  nextConfig.output = 'export';
  nextConfig.distDir = distDir;
}

export default nextConfig;
