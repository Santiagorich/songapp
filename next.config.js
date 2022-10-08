/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
});

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    domains: [
      "is1-ssl.mzstatic.com",
      "is2-ssl.mzstatic.com",
      "is3-ssl.mzstatic.com",
      "is4-ssl.mzstatic.com",
      "is5-ssl.mzstatic.com",
      "is6-ssl.mzstatic.com",
      "is7-ssl.mzstatic.com",
      "is8-ssl.mzstatic.com",
      "is9-ssl.mzstatic.com",
      "is10-ssl.mzstatic.com",
      "is11-ssl.mzstatic.com",
      "is12-ssl.mzstatic.com",
      "is13-ssl.mzstatic.com",
      "is14-ssl.mzstatic.com",
      "is15-ssl.mzstatic.com",
    ],
    unoptimized: true,
  },
};

module.exports = withPWA(nextConfig);
