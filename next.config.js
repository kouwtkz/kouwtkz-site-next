/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // trueだとエラー検出しやすいが、2回レンダリングされる
  // output: 'export',
}

module.exports = nextConfig
