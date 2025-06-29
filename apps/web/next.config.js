const nextConfig= {
  transpilePackages: ["@repo/ui"],
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.us-east-2.amazonaws.com',
      },
    ],
  },
};
export default nextConfig;
