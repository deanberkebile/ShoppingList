import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.40.30'],
  ...(process.env.DOCKER_BUILD && {
    output: 'standalone',
    outputFileTracingRoot: path.join(__dirname, '../../'),
  }),
};

export default nextConfig;
