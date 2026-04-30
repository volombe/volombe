/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/en',
        destination: '/',
        permanent: true,
      },
      {
        source: '/en/:path*',
        destination: '/:path*',
        permanent: true,
      },
      {
        source: '/collections/:path*',
        destination: '/collection.html',
        permanent: true,
      },
      {
        source: '/blogs/:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/pages/contact',
        destination: '/',
        permanent: true,
      },
      {
        source: '/pages/:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/products/:path*',
        destination: '/collection.html',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
