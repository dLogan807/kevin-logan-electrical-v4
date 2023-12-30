/** @type {import('next').NextConfig} */

module.exports = {
  async redirects() {
    return [
      {
        source: "/index.php",
        destination: "/",
        permanent: true, // triggers 308
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
