var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: './src/libvf.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'libvf.js',
    library: 'libvf',
    libraryTarget: 'var',
    //umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              "@babel/plugin-transform-arrow-functions",
              "@babel/plugin-transform-async-to-generator"
            ]
          }
        }
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true,
    proxy: {
      '/': 'https://verified-dev.c11.io'
    }
  },
  performance: {
    hints: false
  },
  devtool: "source-map"
}
