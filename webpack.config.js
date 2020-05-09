module.exports = {
    entry: "./src/index.ts",
    output: {
        filename: "bundle.js",
        publicPath: "",
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
            },
            {
                test: /\.css$/,
                loader:
                    "style-loader!css-loader?modules=true&localIdentName=[local]",
            },
        ],
    },
};
