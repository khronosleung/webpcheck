const path = require('path');
const webpack = require('webpack');

const tmpDir = require('os').tmpdir();

module.exports = {
    entry: {
        'index': './src/index.js',
        'index.min': './src/index.js'
    },

    output: {
        library: 'webPCheck',
        libraryTarget: 'umd',
        libraryExport: 'default',
        publicPath: '',
        path: path.join(__dirname, 'dist'),
        filename: '[name].js'
    },

    module: {
        rules: [{
            test: /\.js$/i,
            exclude: /node_modules/i,
            use: [{
                loader: 'babel-loader',
                options: {
                    cacheDirectory: tmpDir,
                    presets: [
                        [require.resolve('babel-preset-env'), {
                            "targets": {
                                "browsers": [
                                    "Chrome >= 45", "last 2 Firefox versions",
                                    "ie >= 9", "Edge >= 12",
                                    "iOS >= 9", "Android >= 4",
                                    "last 2 ChromeAndroid versions"
                                ]
                            },
                            "useBuiltIns": "usage",
                            "modules": false,
                            "debug": true
                        }]
                    ],
                    plugins: [
                        [require.resolve('babel-plugin-transform-runtime'), {
                            'helpers': false,
                            'polyfill': true,
                            'regenerator': true
                        }]
                    ]
                }
            }]
        }]
    },

    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.optimize.UglifyJsPlugin({
        test: /\.min\.js$/,
        output: {
            ascii_only: true
        },
        beautify: false, // 最紧凑的输出
        comments: false, // 删除所有的注释
        compress: {
            warnings: false, // 在UglifyJs删除没有用到的代码时不输出警告
            drop_console: true, // 删除所有的 `console` 语句, 还可以兼容ie浏览器
            collapse_vars: true, // 内嵌定义了但是只用到一次的变量
            reduce_vars: true // 提取出出现多次但是没有定义成变量去引用的静态值
        }
    })]
};
