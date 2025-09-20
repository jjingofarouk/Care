/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Transpile only undici if needed
    config.module.rules.push({
      test: /\.m?js$/, // Support .js and .mjs
      include: [/node_modules\/undici/],
      resolve: {
        fullySpecified: false, // Fixes module specifier errors
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
          plugins: [], // Optional: add any plugins if needed
          babelrc: false,
          configFile: false,
        },
      },
    });

    return config;
  },
};

module.exports = nextConfig;