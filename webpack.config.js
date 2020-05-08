const webpack = require("webpack");
/*const UglifyJsPlugin = require( 'uglifyjs-webpack-plugin' );*/

module.exports = {
    entry: "./website/src/index.js",
    output: {
        filename: "website/bundle.js",
        publicPath: "",
    },
    module: {
        loaders: [
            {
                test: /\.js/,
                loader: "babel-loader",
                query: {
                    compact: true,
                    presets: [["es2015", { modules: false }]],
                },
            },
            {
                test: /\.css$/,
                loader:
                    "style-loader!css-loader?modules=true&localIdentName=[local]",
            },
        ],
    },
    plugins: [
        /*new UglifyJsPlugin({
      uglifyOptions: {
        ie8: false,
        ecma: 8,
        output: {
          comments: false,
          beautify: false
        },
        compress: true,
        warnings: false
      }
    })*/
    ],
};
