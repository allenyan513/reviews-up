/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.us-east-2.amazonaws.com",
      }
    ],
  },
};
