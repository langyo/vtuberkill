const { resolve } = require("path");
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: {
    character: './src/character/_entry.js',
    card: './src/card/_entry.js',
    mode: './src/mode/_entry.js',
  },
  output: {
    filename: '[name].js',
    path: resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          'ts-loader'
        ],
        exclude: /(node_modules|bower_components)/
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  plugins: [],
  mode: 'development',
  // mode: 'production',
  resolve: {
    // 在导入语句没带文件后缀时，webpack会自动按照顺序添加后缀名查找
    extensions: ['.ts', '.js', '.json'],
    // 配置别名
    alias: {
    }
  }
}