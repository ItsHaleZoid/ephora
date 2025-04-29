/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config: any) => {
    config.resolve.alias['@'] = __dirname;
    return config;
  },
  images: {
    domains: [
      'ihznvqmwfxxscpqcivrt.supabase.co'

    ],
    unoptimized: true, // Allow images from local files
  },
}

export default nextConfig
