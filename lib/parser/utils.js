import fs from 'fs-extra';
/**
 * Reads API type from the API main file.
 * @param {String} file File location
 * @return {Promise}
 */
export async function readApiType(file) {
  const size = 100;
  // todo (pawel): This works 100% for RAML files as they have to have a
  // type and version in the file header. However JSON OAS can have version
  // definition anythere in the JSON object. It works for lot of APIs
  // but it may be broken for some APIs.
  // It should read and parse JSON files and look for the version value.
  // Leaving it here for performance reasons.
  const fd = await fs.open(file, 'r');
  const result = await fs.read(fd, Buffer.alloc(size), 0, size, 0);
  await fs.close(fd);
  const data = result.buffer.toString().trim();
  if (data[0] === '{') {
    // OAS 1/2
    const match = data.match(/"swagger"(?:\s*)?:(?:\s*)"(.*)"/im);
    if (!match) {
      throw new Error('Expected OAS but could not find version header.');
    }
    const v = match[1].trim();
    return {
      type: `OAS ${v}`,
      contentType: 'application/json',
    };
  }
  const oasMatch = data.match(/openapi|swagger(?:\s*)?:(?:\s*)("|')?(\d\.\d*)("|')?/im);
  if (oasMatch) {
    const v = oasMatch[2].trim();
    return {
      type: `OAS ${v}`,
      contentType: 'application/yaml',
    };
  }
  const header = data
    .split('\n')[0]
    .substr(2)
    .trim();
  if (!header || header.indexOf('RAML ') !== 0) {
    throw new Error('The API file header is unknown');
  }
  if (header === 'RAML 1.0' || header === 'RAML 0.8') {
    return {
      type: header,
      contentType: 'application/raml',
    };
  }
  if (header.indexOf('RAML 1.0 Overlay') === 0 || header.indexOf('RAML 1.0 Extension') === 0) {
    return {
      type: 'RAML 1.0',
      contentType: 'application/raml',
    };
  }
  throw new Error('Unsupported API file');
}
