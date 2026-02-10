import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Si tienes imágenes externas (blob, etc.), puedes agregar dominios aquí
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
    ],
  },
}

export default nextConfig
