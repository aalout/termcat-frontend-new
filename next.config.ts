import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGitHubPages ? "/termcat-frontend-new" : "";

const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

const nextConfig: NextConfig = {
  reactCompiler: true,
  basePath,
  poweredByHeader: false,
  compress: !isGitHubPages,
  reactStrictMode: true,
  async rewrites() {
    if (isGitHubPages || !apiUrl) return [];
    return [
      {
        source: "/backend/:path*",
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
  ...(isGitHubPages
    ? {
        output: "export",
        trailingSlash: true,
        images: {
          unoptimized: true,
        },
      }
    : {
        output: "standalone",
        images: {
          unoptimized: false,
          qualities: [70, 75, 92],
        },
      }),
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_USE_API_PROXY: isGitHubPages ? "" : "1",
  },
};

export default nextConfig;
