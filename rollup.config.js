import babel from 'rollup-plugin-babel';
import { eslint } from 'rollup-plugin-eslint';

export default {
    input: 'src/snapscroll.js',
    output: {
        file: 'dist/snapscroll.js',
        name: 'SnapScroll',
        format: 'umd',
    },
    plugins: [
        eslint(),
        babel({
            exclude: 'node_modules/**',
        }),
    ],
};
