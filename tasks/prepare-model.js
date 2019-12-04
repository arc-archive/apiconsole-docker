import path from 'path';
import { ApiParser } from '../lib/parser/index.js';
import config from '../config.js';
import { logger } from '../lib/logging.js';

const IS_PRODUCTION = config.get('NODE_ENV') === 'production';
const modelFile = 'api-model.json';
const modelFileLocation = IS_PRODUCTION ? path.join('/', 'app', modelFile) : modelFile;

export default async function() {
  logger.info(`Processing API file: ${modelFileLocation} ${process.cwd()}`);
  const parser = new ApiParser(modelFileLocation);
  try {
    await parser.run();
  } catch (e) {
    let msg = `Unable to parse API specification file.\n`;
    msg += 'Make sure all variables are set. Visit https://docs.api-console.io/ for more information.\n\n';
    msg += e.message;
    logger.error(msg);
    process.exit(-1);
  }
}
