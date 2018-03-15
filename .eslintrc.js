module.exports = {
    extends: [
        "eslint:recommended",
        "plugin:vue/recommended",
        "plugin:flowtype/recommended"
    ],
    plugins: [
        'html',
        "vue",
        "flowtype"
    ],
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: 'babel-eslint',
        sourceType: 'module'
    },
    env: {
      node: true,
      browser: true,
      "es6": true
    },
    rules: {
        "no-console": "off",
    },
    globals: {
        __static: true
    },
};
