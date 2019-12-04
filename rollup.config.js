import { createCompatibilityConfig } from '@open-wc/building-rollup';
import path from 'path';
import postcss from 'rollup-plugin-postcss';
import cpy from 'rollup-plugin-cpy';

const config = createCompatibilityConfig({
  input: path.join(__dirname, 'index.html'),
  indexHTMLPlugin: {
    minify: {
      minifyJS: true,
      removeComments: true,
    },
  },
});

config[0].context = 'window';
config[1].context = 'window';

// console.log(config);

export default [
  {
    ...config[0],
    plugins: [
      ...config[0].plugins,
      postcss()
    ]
  },
  {
    ...config[1],
    plugins: [
      ...config[1].plugins,
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
