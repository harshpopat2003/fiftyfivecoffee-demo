/** @type {import('next').NextConfig} */

// GitHub Pages serves this project from https://<user>.github.io/<repo>/, so
// every URL needs the repo name in front of it. The deploy workflow sets this;
// locally it stays empty so `next dev` keeps running at the root.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig = {
  reactStrictMode: true,
  // Pages is a static host: no Node server, so no on-demand image optimising.
  output: "export",
  images: { loader: "custom", loaderFile: "./lib/imageLoader.ts" },
  basePath,
};

export default nextConfig;
