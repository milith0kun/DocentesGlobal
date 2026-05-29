/** @type {import('next').NextConfig} */
const nextConfig = {
  // @react-pdf/renderer needs to be external for server components
  serverExternalPackages: ["@react-pdf/renderer"],
};

export default nextConfig;
