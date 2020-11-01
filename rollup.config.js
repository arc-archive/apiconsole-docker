import { createSpaConfig } from '@open-wc/building-rollup';
import merge from 'deepmerge';
import path from 'path';
import cpy from 'rollup-plugin-cpy';
import postcss from 'rollup-plugin-postcss';
const baseConfig = createSpaConfig({
  developmentMode: process.env.ROLLUP_WATCH === 'true',
  injectServiceWorker: false,
});

export default merge(baseConfig, {
  input: path.resolve(__dirname, 'index.html'),
  context: 'window',
  output: {
    sourcemap: false,
  },
  plugins: [
    postcss(),
    cpy({
      files: [
        path.join(__dirname, 'vendor.js'),
        path.join(__dirname, 'robots.txt'),
      ],
      dest: 'dist',
      options: {
        parents: false,
      },
    }),
    cpy({
      files: [
        path.join('resources', 'styles','*.css'),
      ],
      dest: 'dist',
      options: {
        parents: true,
      },
    }),
  ],
});



// const config = createCompatibilityConfig({
//   input: path.join(__dirname, 'index.html'),
//   indexHTMLPlugin: {
//     minify: {
//       minifyJS: true,
//       removeComments: true,
//     },
//   },
// });

// config[0].context = 'window';
// config[1].context = 'window';

// export default [
//   {
//     ...config[0],
//     plugins: [
//       ...config[0].plugins,
//       postcss()
//     ]
//   },
//   {
//     ...config[1],
//     plugins: [
//       ...config[1].plugins,
//       postcss(),
//       cpy({
//         files: [
//           path.join(__dirname, 'vendor.js'),
//           path.join(__dirname, 'robots.txt'),
//         ],
//         dest: 'dist',
//         options: {
//           parents: false,
//         },
//       }),
//       cpy({
//         files: [
//           path.join('resources', 'styles','*.css')
//         ],
//         dest: 'dist',
//         options: {
//           parents: true,
//         },
//       }),
//     ],
//   },
// ];
