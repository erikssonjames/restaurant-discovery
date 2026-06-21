import type { NextConfig } from "next"

const strapiUrl = new URL(process.env.STRAPI_API_URL || "http://localhost:1337")

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: strapiUrl.protocol.replace(":", "") as "http" | "https",
        hostname: strapiUrl.hostname,
        port: strapiUrl.port,
        pathname: "/uploads/**",
      },
    ],
  },
}

export default nextConfig
