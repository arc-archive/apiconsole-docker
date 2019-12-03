import { createDefaultConfig } from '@open-wc/building-rollup';
import path from 'path';
import postcss from 'rollup-plugin-postcss';
import cpy from 'rollup-plugin-cpy';

const config = createDefaultConfig({
  input: path.join(__dirname, 'index.html'),
  indexHTMLPlugin: {
    minify: {
      minifyJS: true,
      removeComments: true,
    },
  },
});

config.output.dir = 'dist';
config.context = 'window';

// console.log(config);

export default [
  {
    ...config,
    plugins: [
      ...config.plugins,
      postcss(),
      cpy({
        files: [
          path.join(__dirname, 'vendor.js'),
        ],
        dest: 'dist',
        options: {
          parents: false,
        },
      }),
      cpy({
        files: [
          path.join('resources', 'styles','*.css')
        ],
        dest: 'dist',
        options: {
          parents: true,
        },
      }),
    ],
  },
];
