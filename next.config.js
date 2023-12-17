/** @type {import('next').NextConfig} */

// trueだとエラー検出しやすいが、2回レンダリングされる
const strictConfig = {
  reactStrictMode: false
}

const cwd = process.cwd();

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

const exportConfig = (() => {
  if (outputMode === 'export' && process.env.NODE_ENV !== 'development') {
    try {
      require("fs").mkdirSync(`${cwd}/${process.env.CACHE_DIR}`)
    } catch { }
    return {
      output: 'export',
      distDir: process.env.DICT_DIR,
      images: { loader: 'custom' },
      // domains: ['images.microcms-assets.io'],
    }
  } else {
    return {}
  }
})();

const nextConfig = {
  ...strictConfig,
  ...envConfig,
  ...imageConfig,
  ...exportConfig,
}

module.exports = nextConfig
