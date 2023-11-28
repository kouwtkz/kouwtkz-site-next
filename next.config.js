/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // trueだとエラー検出しやすいが、2回レンダリングされる
  // SSGでImageを出力する際はローダーが必要
  output: 'export',
  distDir: 'out/dist/',
  images: {
    loader: 'custom',
    domains: ['images.microcms-assets.io'],
  }
}

module.exports = nextConfig
