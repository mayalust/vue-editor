const webpack = require('webpack');
const pathLib = require('path');
const { VueLoaderPlugin } = require('vue-loader')
const __DEVELOPMENT__ = {
  entry: {
    comps : pathLib.join(__dirname, "dist/www/config.js")
  },
  output: {
    path : pathLib.join(__dirname, "dist/www"),
    filename: "[name].js"
  },
  mode : "development",
  module: {
    rules: [
      { test: /\.vue$/, use: ['vue-loader']},
      { test: /\.css$/,
        use: ["style-loader", "css-loader"],
        exclude:"/bootstrap/"},
      { test: /\.less$/, use: ["style-loader", "css-loader", "less-loader"]},
      {
        test:'/\.js$/',
        use:{
          loader:'babel-loader',
          query: {
            presets: ['es2015'] //按照最新的ES6语法规则去转换
          }
        },
        exclude:/node_module/
      }
    ]
  },
  resolve: {
    alias: { 'vue': 'vue/dist/vue.js' }
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}
module.exports = __DEVELOPMENT__;