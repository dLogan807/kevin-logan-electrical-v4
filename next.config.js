/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  swcMinify: true,
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
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; font-src 'self'; frame-src https://www.google.com; img-src 'self'; script-src 'self' https://www.google.com/recaptcha/api.js https://www.gstatic.com/; style-src 'self'; manifest-src 'self';",
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
};
