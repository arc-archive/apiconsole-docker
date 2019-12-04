const UglifyJS = require('uglify-js');
const fs = require('fs-extra');
const path = require('path');

const vendorName = 'vendor.js';
const distPath = path.join('dist', vendorName);

const CryptoFiles = [
  'cryptojslib/components/core.js',
  'cryptojslib/components/sha1.js',
  'cryptojslib/components/enc-base64.js',
  'cryptojslib/components/md5.js',
  'jsrsasign/lib/jsrsasign-rsa-min.js',
];

const CmFiles = [
  'jsonlint/web/jsonlint.js',
  'codemirror/lib/codemirror.js',
  'codemirror/addon/mode/loadmode.js',
  'codemirror/mode/meta.js',
  'codemirror/mode/javascript/javascript.js',
  'codemirror/mode/xml/xml.js',
  'codemirror/mode/yaml/yaml.js',
  'codemirror/mode/htmlmixed/htmlmixed.js',
  'codemirror/addon/lint/lint.js',
  'codemirror/addon/lint/json-lint.js',
];

async function prepareDemo() {
  const code = {};
  for (let i = 0, len = CryptoFiles.length; i < len; i++) {
    const file = CryptoFiles[i];
    const full = require.resolve(file);
    code[file] = await fs.readFile(full, 'utf8');
  }
  for (let i = 0, len = CmFiles.length; i < len; i++) {
    const file = CmFiles[i];
    const full = require.resolve(file);
    code[file] = await fs.readFile(full, 'utf8');
  }

  const result = UglifyJS.minify(code);
  await fs.writeFile('vendor.js', result.code, 'utf8');


  const exists = await fs.pathExists(distPath);
  // only updates vendor package when dist already exists.
  if (exists) {
    await fs.remove(distPath);
    await fs.copy(vendorName, distPath);
  }
}

prepareDemo();
