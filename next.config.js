/** @type {import('next').NextConfig} */
module.exports = {
  trailingSlash: true,
  async rewrites() {
    return [
      {
        // Ruta con slash final
        source: '/api/:path*/',
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/:path*/`,
      },
    ];
  },
};

// // frontend/next.config.js
// module.exports = {
//   async rewrites() {
//     return [
//       {
//         source: '/api/:path*',
//         destination: 'http://backend:8000/api/:path*/', // nombre del servicio docker y puerto
//       },
//     ]
//   },
// }