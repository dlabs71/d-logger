import {babel} from "@rollup/plugin-babel";
import {terser} from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import {nodeResolve} from '@rollup/plugin-node-resolve';

export default [{
    input: 'src/index.js',
    output: [
        {
            exports: "named",
            file: 'dist/d-logger.min.js',
            format: 'umd',
            name: 'dlogger',
            globals: {
                fs: "fs",
                path: "path"
            }
        }
    ],
    plugins: [
        commonjs(),
        nodeResolve(),
        babel({
            babelrc: false,
            presets: [
                "@babel/preset-env"
            ],
            plugins: [
                "@babel/plugin-transform-runtime"
            ],
            babelHelpers: "runtime"
        }),
        terser()
    ],
}];