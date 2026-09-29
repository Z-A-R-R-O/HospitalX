import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  // The Windows installer packages this output with a private Node runtime so
  // HospitalX can run as a local desktop product after installation.
  output: "standalone",
  // Keep native installer packaging isolated from a live `next dev` / preview
  // process, which may otherwise hold the default .next cache open on Windows.
  distDir: process.env.HOSPITALX_DESKTOP_BUILD === "1" ? ".next-desktop" : ".next",
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2_592_000,
  },
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
    cpus: 1,
    webpackBuildWorker: false,
  },
  async redirects() {
    return [
      {
        source: "/mobile/:path*",
        destination: "/dashboard",
        permanent: false,
      },
    ];
  },
};
export default nextConfig;
