/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // @react-pdf/renderer needs to be external for server components
  serverExternalPackages: ["@react-pdf/renderer"],
};

export default nextConfig;
