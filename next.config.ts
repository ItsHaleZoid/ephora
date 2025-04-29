const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'ihznvqmwfxxscpqcivrt.supabase.co'
    ],
    unoptimized: true, // Allow images from local files
  },
  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve(__dirname);
    return config;
  },
}

module.exports = nextConfig;
