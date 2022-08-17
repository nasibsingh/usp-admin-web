const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const DIST_DIR = path.resolve(__dirname, "dist");
const SRC_DIR = path.resolve(__dirname, "src");

const htmlWebPack = new HtmlWebPackPlugin({
  template: path.join(SRC_DIR, "assets/index.html"),
});

const extractCss = new MiniCssExtractPlugin({
  filename: "assets/css/style.min.css",
});

const copyImagesToDist = new CopyPlugin({
  patterns: [
    {
      from: "src/assets/images",
      to: "assets/images/[name][ext]",
      toType: "template",
    },
  ],
});

module.exports = {
  entry: [
    `${SRC_DIR}/index.tsx`,
    `${SRC_DIR}/assets/sass/style.scss`,
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  output: {
    path: DIST_DIR,
    filename: '[name].[hash:8].js',
    chunkFilename: '[id].[hash:8].js',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        default: false,
        vendors: false,
        vendor: {
          chunks: "all",
          test: /node_modules/,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [ MiniCssExtractPlugin.loader,"css-loader","sass-loader"],
      },
      {
        test: /\.(svg|woff|woff2|ttf|eot|otf)([\?]?.*)$/,
        exclude: [`${SRC_DIR}/assets/images/`],
        include: SRC_DIR,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "assets/css/fonts/",
              publicPath: "fonts/",
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        exclude: [`${SRC_DIR}/assets/fonts/`],
        include: SRC_DIR,
        use: [
          {
            loader: "file-loader",
            options: {
              name: '[name].[ext]',
              outputPath: "/assets/images/",
              publicPath: "../images/",
              name: '[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [htmlWebPack, copyImagesToDist, extractCss],
};
