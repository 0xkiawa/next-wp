/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '',
          pathname: '/mywordpress/wordpress/wp-content/uploads/**',
        },
      ],
    },
  };
  
  export default nextConfig;