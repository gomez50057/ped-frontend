/** @type {import('next').NextConfig} */
module.exports = {
  trailingSlash: true,
  async rewrites() {
    return [
      {
        // Ruta con slash final
        source: '/api/:path*/',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*/`,
      },
    ];
  },
};

