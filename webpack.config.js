const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack')
const Dotenv = require('dotenv-webpack')

let config = {
  mode: 'development'
}


module.exports = {
  mode: config.mode,
  experiments: {
    asset: true
  },
  entry: {
    main: path.resolve(__dirname, './src/index.js'),
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
  },
  devServer: {
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, './dist'),
    open: true,
    compress: true,
    hot: true,
    port: 8080,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|)$/,
        type: 'asset/inline',
      },
      {
        test: /\.(scss|css)$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.svg$/,
        type: 'asset/inline',
        use: 'svgo-loader'
      }
    ],
  },
  devtool: config.mode === 'production' ? undefined : 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Chat',
      template: path.resolve(__dirname, './pages/index.html'),
      filename: 'index.html',
    }),
    new HtmlWebpackPlugin({
      title: 'Chat-Login',
      template: path.resolve(__dirname, './pages/login/index.html'),
      filename: 'login/index.html',
    }),
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new Dotenv({
      path: config.mode === 'production' ? './prod.env' : './dev.env',
      safe: true
    }),
  ],
}