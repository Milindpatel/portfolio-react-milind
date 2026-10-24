/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    // Bootstrap's own Sass still uses deprecated APIs; keep the build log readable.
    quietDeps: true,
  },
};

export default nextConfig;
