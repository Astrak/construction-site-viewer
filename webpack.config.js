const path = require("path");
const config = {
    entry: "./src/index.ts",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname),
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    module: {
        rules: [
            { test: /\.tsx?$/, loader: "ts-loader" },
            {
                test: /\.css$/,
                loader:
                    "style-loader!css-loader?modules=true&localIdentName=[local]",
            },
        ],
    },
    plugins: [],
};

module.exports = (env, argv) => {
    const isProduction = argv.mode === "production";
    config.mode = isProduction ? "production" : "development";
    if (isProduction) {
        const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
        const CompressionPlugin = require("compression-webpack-plugin");
        const uglify = new UglifyJsPlugin({
            uglifyOptions: {
                ie8: false,
                ecma: 8,
                output: {
                    comments: false,
                    beautify: false,
                },
                compress: true,
                warnings: false,
            },
        });
        const gzip = new CompressionPlugin();
        config.plugins.push(...[uglify, gzip]);
    } else {
        config.devtool = "eval-source-map";
    }
    return config;
};
