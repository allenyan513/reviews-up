const nextConfig = {
  transpilePackages: ['@reviewsup/ui', '@reviewsup/embed-react'],
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
