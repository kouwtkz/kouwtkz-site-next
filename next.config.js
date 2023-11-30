/** @type {import('next').NextConfig} */

// trueだとエラー検出しやすいが、2回レンダリングされる
const strictConfig = {
  reactStrictMode: false
}

// SSGでImageを出力する際はローダーが必要
const outputMode = process.env.OUTPUT_MODE || null;

const exportConfig = (() => {
  if (outputMode === 'export') {
    try {
      const fs = require("fs"), cwd = process.cwd();
      fs.mkdirSync(`${cwd}/${process.env.CACHE_DIR}`)
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
  ...exportConfig,
}

module.exports = nextConfig
