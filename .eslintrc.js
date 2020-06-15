module.exports = {
    root: true,
    env: {
        es6: true,
    },
    ecmaFeatures: {
        // env=es6 doesn't include modules, which we are using
        modules: true,
    },
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:eslint-comments/recommended",
        "plugin:eslint-import/recommended",
        "plugin:eslint-node/recommended",
        "plugin:eslint-react/recommended",
        "plugin:eslint-react-hooks/recommended",
        "prettier/@typescript-eslint",
    ],
    rules: {
        "quotes": ["error", "double"],
        "eqeqeq": "error",
        "no-alert": 2,
    },
};
