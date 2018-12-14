const path = require("path");

const nodeEnv = process.env.NODE_ENV || "development";
const isProd = nodeEnv === "production";
const baseDir = __dirname;
const targetFileName = "fetch-client"+(isProd ? "" : ".dev")+".js";

module.exports = {
  entry: "./src/index.js",

  output: {
    path: path.resolve(baseDir, "dist"),
    filename: targetFileName,
    library: "FetchClient",
    libraryTarget: "umd"
  },

  mode: nodeEnv,

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      }
    ]
  },

  devtool: isProd ? "none" : "source-map"
};
