/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false, // 启用图片优化：自动 WebP、按需尺寸，提升加载速度
    deviceSizes: [640, 750, 828, 1080, 1200],
  },
  // 允许手机通过局域网 IP 访问 dev 时的静态资源，避免 404
  allowedDevOrigins: ['localhost', '127.0.0.1', '192.168.1.227'],
}

export default nextConfig
