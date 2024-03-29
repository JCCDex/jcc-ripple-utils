const DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");
const path = require("path");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const config = {
  entry: "./lib",
  output: {
    filename: "jcc-ripple-utils.min.js",
    path: path.resolve(__dirname, "./dist"),
    library: "jcc_ripple_utils",
    libraryTarget: "umd"
  },
  target: "web",
  resolve: {
    extensions: [".js", ".ts"],
    alias: {
      "bn.js": path.resolve(__dirname, "node_modules/bn.js"),
      // "bignumber.js": path.resolve(__dirname, "node_modules/bignumber.js"),
      "elliptic": path.resolve(__dirname, "node_modules/elliptic"),
      "ripple-keypairs": path.resolve(__dirname, "node_modules/ripple-keypairs")
    }
  },
  mode: process.env.MODE === "dev" ? 'development' : "production",
  node: {
    fs: "empty",
    tls: "empty",
    "child_process": "empty",
    net: "empty"
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: "ts-loader",
      exclude: /node_modules/
    }]
  },
  plugins: [
    new DuplicatePackageCheckerPlugin({
      strict: false
    })
  ]
};

if (process.env.REPORT === "true") {
  config.plugins.push(new BundleAnalyzerPlugin())
}

if (process.env.MODE !== "dev") {
  config.plugins.push(new UglifyJsPlugin({
    uglifyOptions: {
      compress: {
        sequences: true,
        dead_code: true,
        drop_console: true,
        drop_debugger: true,
        unused: true
      }
    },
    sourceMap: false,
    parallel: true
  }))
}

module.exports = config;