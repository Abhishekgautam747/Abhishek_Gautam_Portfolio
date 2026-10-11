/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',          // static HTML export → works with GitHub Pages
  images: { unoptimized: true },
  trailingSlash: true,       // better for GitHub Pages
  basePath: process.env.NODE_ENV === 'production' ? '' : '', // set later if repo is username.github.io
};

module.exports = nextConfig;
