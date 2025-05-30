/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  // Policies:
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/a/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/index.php",
        destination: "/",
        permanent: true, // Triggers 308
      },
      {
        source: "/aboutus.php",
        destination: "/aboutus",
        permanent: true,
      },
      {
        source: "/rateandservices.php",
        destination: "/rateandservices",
        permanent: true,
      },
      {
        source: "/contactus.php",
        destination: "/contactus",
        permanent: true,
      },
    ];
  },
  experimental: { optimizePackageImports: ["@mantine/core", "@mantine/hooks"] },
};
