module.exports = {
    "extends": "eslint:recommended",
    plugins: ["vue"],
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module'
    },
    env: {
      node: true,
      browser: true,
      "es6": true
    },
    rules: {
        "no-console": "off",
    }
};
