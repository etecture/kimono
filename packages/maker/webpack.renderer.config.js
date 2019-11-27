const path = require('path');
const merge = require('webpack-merge');

const rootDir = path.resolve(__dirname, '../..');

const { excludeWorkspaceLibs } = require('./webpack.utils');

module.exports = config => {
  config = excludeWorkspaceLibs(config, rootDir);
  config = merge.smart(config, {
    resolve: {
      alias: {
        renderer: path.resolve(__dirname, 'src/renderer')
      }
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          include: /node_modules/,
          use: ['react-hot-loader/webpack']
        }
      ]
    }
  });

  config.externals = ['node-pty', 'electron-store'];
  return config;
};
