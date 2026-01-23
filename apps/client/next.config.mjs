/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui", "@workspace/translations"],
  webpack: (config) => {
    config.resolve.extensionAlias = {
      ".js": [".ts", ".tsx", ".js", ".jsx"],
      ".mjs": [".mts", ".mjs"],
      ".cjs": [".cts", ".cjs"],
    };
    return config;
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      // Local development (HTTP)
      {
        protocol: "http",
        hostname: "localhost",
        port: "5051",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5001",
        pathname: "/uploads/**",
      },
      // Production backend (HTTPS)
      {
        protocol: "https",
        hostname: "ec2-3-64-58-144.eu-central-1.compute.amazonaws.com",
        pathname: "/uploads/**",
      },
      // Legacy IP addresses (keep for backward compatibility, but prefer HTTPS)
      {
        protocol: "https",
        hostname: "69.62.107.139",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "69.62.107.139",
        port: "5001",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "69.62.107.139",
        port: "5051",
        pathname: "/uploads/**",
      },
      // Local network (HTTP only)
      {
        protocol: "http",
        hostname: "192.168.1.22",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "192.168.1.22",
        port: "5001",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "192.168.1.22",
        port: "5051",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
