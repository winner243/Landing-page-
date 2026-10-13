import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  transpilePackages: [
    "@landing/analytics",
    "@landing/copywriting",
    "@landing/design-tokens",
    "@landing/marketing",
    "@landing/patterns",
    "@landing/themes",
    "@landing/ui-core",
  ],
};

export default nextConfig;
