/** @type {import('next').NextConfig} */

// trueだとエラー検出しやすいが、2回レンダリングされる
const strictConfig = {
  reactStrictMode: false
}

// 環境変数定義
const envConfig = {
  env: {
    // OUTPUT_MODE: "export"
  }
}

// SSGでImageを出力する際はローダーが必要
const outputMode = envConfig.env.OUTPUT_MODE || null;

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
  ...envConfig,
  ...exportConfig,
}

module.exports = nextConfig
