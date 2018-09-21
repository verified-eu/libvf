var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: './src/libvf.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'libvf.js',
    library: 'libvf',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['es2015'],
              plugins: [
                "transform-class-properties",
                "syntax-class-properties"
              ]
            }
          }
        ],
        exclude: /node_modules/
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
  devtool: '#eval-source-map'
}
