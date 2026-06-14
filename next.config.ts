import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGitHubPages ? "/termcat-frontend-new" : "";

const nextConfig: NextConfig = {
  reactCompiler: true,
  basePath,
  poweredByHeader: false,
  compress: !isGitHubPages,
  reactStrictMode: true,
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
  },
};

export default nextConfig;
