/** @type {import('next').NextConfig} */

function getBackendOrigin() {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
  return apiBase.replace(/\/api(?:\/.*)?\/?$/, "").replace(/\/$/, "");
}

const nextConfig = {
  output: "standalone",
  trailingSlash: true,
  async rewrites() {
    const backendOrigin = getBackendOrigin();
    return [
      {
        source: "/api/:path*/",
        destination: `${backendOrigin}/api/:path*/`,
      },
      {
        source: "/api/:path*",
        destination: `${backendOrigin}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
