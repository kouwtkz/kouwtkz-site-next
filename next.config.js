/** @type {import('next').NextConfig} */

// trueだとエラー検出しやすいが、2回レンダリングされる
const strictConfig = {
  reactStrictMode: false
}

const cwd = process.cwd();
const fs = require("fs");
const path = require("path");

const envConfig = { env: {} }

/// .secret/.envから環境変数取り込み
try {
  const secretEnv = require('dotenv').config({ path: `${cwd}/.secret/.env` });
  envConfig.env = { ...envConfig.env, ...secretEnv.parsed };
} catch { }

const imageConfig = { images: { remotePatterns: [] } }

const mediaHost = process.env.MEDIA_HOST_CONTAINER;
if (mediaHost) {
  const mediaHostURL = new URL(mediaHost);
  imageConfig.images.remotePatterns.push({
    protocol: mediaHostURL.protocol.slice(0, -1),
    hostname: mediaHostURL.hostname,
    port: mediaHostURL.port,
  });
}

// SSGでImageを出力する際はローダーが必要
const outputMode = process.env.OUTPUT_MODE || null;
const isBuild = process.env.NODE_ENV === 'production';
const isStaticBuild = outputMode === 'export' && isBuild;
const distDir = process.env.DIST_DIR;

if (isBuild) {
  const { execSync } = require('child_process');
  const ROOT = process.env.ROOT || "";
  const cd = ROOT ? `cd ${ROOT} && ` : "";
  console.log(String(
    execSync(cd + 'node -r dotenv/config ./mediaScripts/MediaUpdate.mjs', { windowsHide: true })
  ))
}

const exportConfig = (() => {
  if (isStaticBuild) {
    return {
      output: 'export',
      distDir,
      images: { loader: 'custom' },
      // domains: ['images.microcms-assets.io'],
    }
  } else {
    return {}
  }
})();

if (isStaticBuild) {
  const distFullDir = path.resolve(`${cwd}/${process.env.DIST_DIR}`);
  fs.rm(distFullDir, { recursive: true }, () => { });
}

const nextConfig = {
  ...strictConfig,
  ...envConfig,
  ...imageConfig,
  ...exportConfig,
  webpack: (config) => {
    // Avoid: Can't resolve 'canvas'
    config.externals.push({
      canvas: 'canvas',
    });
    return config
  },
}

module.exports = nextConfig
