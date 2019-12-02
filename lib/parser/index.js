import path from 'path';
// import fs from 'fs-extra';
import { logger } from '../logging.js';
import config from '../../config.js';

const API_PROJECT = config.get('API_PROJECT');
// const API_TYPE = config.get('API_TYPE');
// const API_MIME = config.get('API_MIME');

const apiProjectLocation = path.join('/', 'app', 'api');

export class ApiParser {
  async run() {
    logger.info(`Running API parser for ${API_PROJECT}`);
    let loc;
    if (API_PROJECT.indexOf('http') === 0) {
      // API is in the remote location, leave it to the parser
      loc = API_PROJECT;
    } else {
      loc = path.join(apiProjectLocation, API_PROJECT);
    }

    try {
      await this.processApi(loc);
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  // async processApi(file) {
  //
  // }
}
