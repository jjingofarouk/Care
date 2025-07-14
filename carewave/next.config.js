// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.m?js$/,
      include: [/node_modules\/undici/],
      resolve: {
        fullySpecified: false,
      },
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                targets: isServer ? { node: 'current' } : { esmodules: true },
              },
            ],
          ],
          babelrc: false,
          configFile: false,
        },
      },
    });

    return config;
  },
};

module.exports = withPWA(nextConfig);