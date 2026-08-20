/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/images/shazoniques-inspiration-logo.png",
        destination: "/images/pep-practice-grade4-primary.png",
      },
    ]
  },
}

export default nextConfig
