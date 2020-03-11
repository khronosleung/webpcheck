import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';
import commonJs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { minify } from 'uglify-es';

const pkg = require('./package.json');

const babelConfig = {
    babelrc: false,
    runtimeHelpers: true,
    externalHelpers: true,
    presets: [
        ['@babel/preset-env', {
            targets: {
                browsers: ['iOS >= 9', 'Android >= 4', 'last 2 ChromeAndroid versions']
            },
            useBuiltIns: 'entry',
            corejs: 3,
        }]
    ]
};

const productionPlugins = [
    babel(babelConfig),
    replace({
        'process.env.NODE_ENV': "'production'",
    }),
    resolve(),
    terser(
        {
            compress: {
                pure_getters: true,
                unsafe: true,
            },
            output: {
                comments: false,
                semicolons: false,
            },
            mangle: {
                reserved: ['payload', 'type', 'meta'],
            },
        },
        minify
    ),
];

const umdProduction = {
    input: 'src/index.js',
    output: [
        {
            name: 'WebPCheck',
            file: pkg.browser,
            format: 'umd',
            exports: 'named',
            sourcemap: true,
        }, // Universal Modules
    ],
    plugins: productionPlugins,
};

const cjsProduction = {
    input: 'src/index.js',
    output: [
        {
            file: `${pkg.main}/webpcheck.min.js`,
            format: 'cjs',
            exports: 'named',
            sourcemap: true,
        }, // CommonJS Modules
    ],
    plugins: productionPlugins.concat(commonJs()),
};


// full source development builds
const development = {
    input: 'src/index.js',
    output: [
        { file: `${pkg.main}/webpcheck.js`, format: 'cjs', exports: 'named' }, // CommonJS Modules
        { file: pkg.module, format: 'es', exports: 'named', sourcemap: true }, // ES Modules
    ],
    plugins: [
        replace({
            'process.env.NODE_ENV': '"development"',
        }),
        resolve(),
        babel(babelConfig),
    ],
};
// point user to needed build
const root = `"use strict";module.exports="production"===process.env.NODE_ENV?require("./webpcheck.min.js"):require("./webpcheck.js");`;

const rootFile = folder => {
    mkdirSync(join('dist', folder));
    writeFileSync(join('dist', folder, 'index.js'), root);
};

export default (() => {
    // generate root mapping files
    mkdirSync('dist');
    rootFile('cjs');

    return [development, umdProduction, cjsProduction];
})()
