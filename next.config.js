/** @type {import('next').NextConfig} */

// trueだとエラー検出しやすいが、2回レンダリングされる
const strictConfig = {
  reactStrictMode: false
}

// SSGでImageを出力する際はローダーが必要
const outputMode = process.env.OUTPUT_MODE || null;

const exportConfig =
  outputMode === 'export' ?
    {
      output: 'export',
      distDir: 'out/dist/',
      images: {
        loader: 'custom',
        domains: ['images.microcms-assets.io'],
      }

    } : {}

const nextConfig = {
  ...strictConfig,
  ...exportConfig,
}

module.exports = nextConfig
