/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure server components can use native modules cleanly
  serverExternalPackages: [],
};

export default nextConfig;
