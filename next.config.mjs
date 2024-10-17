/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      { protocol: "https", hostname: "*" },
      { protocol: "https", hostname: "localhost" },
    ],
  },
};

export default nextConfig;
