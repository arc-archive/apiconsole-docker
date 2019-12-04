import { fork } from 'child_process';
import path from 'path';
import fs from 'fs-extra';
import { logger } from '../logging.js';
import config from '../../config.js';
import { readApiType } from './utils.js';

const IS_PRODUCTION = config.get('NODE_ENV') === 'production';
const API_PROJECT = config.get('API_PROJECT');
const apiProjectLocation = IS_PRODUCTION ? path.join('/', 'app', 'api') : path.join(__dirname, '..', '..','demo-api');

export class ApiParser {
  /**
   * @param {String} modelFile API model file location
   */
  constructor(modelFile) {
    this.modelFile = modelFile;
  }

  async run() {
    logger.info(`Running API parser for ${API_PROJECT} in ${apiProjectLocation}`);
    let loc;
    if (API_PROJECT.indexOf('http') === 0) {
      // API is in the remote location, leave it to the parser
      loc = API_PROJECT;
    } else {
      loc = path.join(apiProjectLocation, API_PROJECT);
    }
    try {
      const model = await this.processApi(loc);
      await fs.writeFile(this.modelFile, model);
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }
  /**
   * Finds API type and mime and runs the parser.
   *
   * @param {String} apiLocation Complete API main file location.
   * @return {Promise<String>} A promise resolved to the model.
   */
  async processApi(apiLocation) {
    logger.info(`Running API parser for ${apiLocation}`);
    let type = config.get('API_TYPE');
    let contentType = config.get('API_MIME');
    if (!type || !contentType) {
      const info = await readApiType(apiLocation);
      type = info.type;
      contentType = info.contentType;
    }
    const typeOptions = {
      type,
      contentType,
    };
    return await this._runParser(apiLocation, typeOptions);
  }

  async cleanup() {
    this._cancelMonitorParser();
    this._cancelParseProcTimeout();
    const proc = this._parserProc;
    if (!proc) {
      return this.cancel();
    }
    return new Promise(resolve => {
      this._killParser();
      proc.on('exit', () => {
        resolve();
      });
    });
  }

  _createParserProcess() {
    if (this._parserProc) {
      if (this._parserProc.connected) {
        return this._parserProc;
      }
      this._killParser();
    }
    const env = { ...process.env };
    env.NODE_OPTIONS = '--max-old-space-size=4096';
    const options = {
      execArgv: [],
      env,
    };
    this._parserProc = fork(`${__dirname}/amf-parser.js`, options);
    this._parserProc.on('exit', () => {
      this._cancelParseProcTimeout();
      this._cancelMonitorParser();
      this._parserProc = undefined;
    });
    return this._parserProc;
  }

  _setParserProcTimeout(cb, time = 180000) {
    this._parserProcCb = cb;
    this._parserProceTimeout = setTimeout(() => {
      this._parserProceTimeout = undefined;
      this._killParser();
      const fn = this._parserProcCb;
      this._parserProcCb = undefined;
      fn();
    }, time);
  }

  _cancelParseProcTimeout() {
    if (this._parserProceTimeout) {
      clearTimeout(this._parserProceTimeout);
      this._parserProceTimeout = undefined;
      this._parserProcCb = undefined;
    }
  }

  _killParser() {
    this._cancelParseProcTimeout();
    this._cancelMonitorParser();
    if (this._parserProc) {
      this._parserProc.disconnect();
      this._parserProc.removeAllListeners('message');
      this._parserProc.removeAllListeners('error');
      this._parserProc.removeAllListeners('exit');
      this._parserProc.kill();
      this._parserProc = undefined;
    }
  }

  _monitorParserProc() {
    this._parserMinitorTimeout = setTimeout(() => {
      this._parserMinitorTimeout = undefined;
      this._killParser();
    }, 60000);
  }

  _cancelMonitorParser() {
    if (this._parserMinitorTimeout) {
      clearTimeout(this._parserMinitorTimeout);
    }
  }

  /**
   * Runs the parser.
   *
   * @param {String} apiLocation API file location
   * @param {Object} type API type info object.
   * @return {Promise}
   */
  _runParser(apiLocation, type) {
    this._cancelMonitorParser();
    return new Promise((resolve, reject) => {
      const callbacks = {
        onmessage: result => {
          if (result.validation) {
            logger.warn(result.validation);
            return;
          }
          this._cancelParseProcTimeout();
          this._parserProc.removeAllListeners('message', callbacks.onmessage);
          this._parserProc.removeAllListeners('error', callbacks.onerror);
          this._parserProcCb = undefined;
          this._monitorParserProc();
          this._killParser();
          if (result.error) {
            reject(new Error(result.error));
          } else {
            resolve(result.api);
          }
        },
        onerror: err => {
          this._cancelParseProcTimeout();
          this._parserProc.removeAllListeners('message', callbacks.onmessage);
          this._parserProc.removeAllListeners('error', callbacks.onerror);
          this._parserProcCb = undefined;
          this._monitorParserProc();
          reject(new Error(err.message || 'Unknown error'));
        },
      };

      const proc = this._createParserProcess();
      this._setParserProcTimeout(() => {
        reject(new Error('API parsing timeout'));
        this._parserProc.removeAllListeners('message', callbacks.onmessage);
        this._parserProc.removeAllListeners('error', callbacks.onerror);
        this._monitorParserProc();
      });
      proc.on('message', callbacks.onmessage);
      proc.on('error', callbacks.onerror);
      proc.send({
        source: apiLocation,
        from: type,
        validate: this.validate,
      });
    });
  }
}
