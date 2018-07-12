var webpack = require('webpack');
console.log("webpack");
var __DEVELOPMENT__ = {
  entry: "./dist/veditor.js",
  devtool : 'inline-source-map',
  output: {
    filename: "./bundle.js"
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
  devServer: {
    contentBase: "./",
    historyApiFallback: true,
    inline: true
  }
}
module.exports = __DEVELOPMENT__;