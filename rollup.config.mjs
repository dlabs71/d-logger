import {babel} from "@rollup/plugin-babel";
import {terser} from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import del from "rollup-plugin-delete";
import externals from "rollup-plugin-node-externals";

export default [{
    external: [
        'fs',
        'path'
    ],
    input: 'src/index.js',
    output: [
        {
            file: 'dist/d-logger.min.js',
            format: 'esm',
            name: 'd-logger'
        }
    ],
    plugins: [
        del({ targets: "dist/*" }),
        externals({ deps: true }),
        nodeResolve(),
        commonjs(),
        babel({
            babelrc: false,
            exclude: "**/node_modules/**",
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