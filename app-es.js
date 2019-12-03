/**
 * @license
 * Copyright 2019, Mulesoft.
 *
 * THE WORK (AS DEFINED BELOW) IS PROVIDED UNDER THE TERMS OF
 * THIS CREATIVE COMMONS PUBLIC LICENSE ("CCPL" OR "LICENSE").
 * THE WORK IS PROTECTED BY COPYRIGHT AND/OR OTHER APPLICABLE LAW.
 * ANY USE OF THE WORK OTHER THAN AS AUTHORIZED UNDER THIS LICENSE OR
 * COPYRIGHT LAW IS PROHIBITED.
 *
 * BY EXERCISING ANY RIGHTS TO THE WORK PROVIDED HERE,
 * YOU ACCEPT AND AGREE TO BE BOUND BY THE TERMS OF THIS LICENSE.
 * THE LICENSOR GRANTS YOU THE RIGHTS CONTAINED HERE IN CONSIDERATION
 * OF YOUR ACCEPTANCE OF SUCH TERMS AND CONDITIONS.
 *
 * See LICENSE.md for license content.
 */
import path from 'path';
import fs from 'fs';
import express from 'express';
import serveStatic from 'serve-static';
import compression from 'compression';
import config from './config.js';
import { requestLogger, logger } from './lib/logging.js';
import { modelExists, modelRoute } from './lib/Utils.js';
import { ApiParser } from './lib/parser/index.js';

const app = express();
export default app;

const IS_PRODUCTION = config.get('NODE_ENV') === 'production';
const modelFile = 'api-model.json';
const modelFileLocation = IS_PRODUCTION ? path.join('/', 'app', modelFile) : modelFile;

app.disable('etag');
app.disable('x-powered-by');
app.set('trust proxy', true);
app.use(requestLogger);
app.use(compression());

const serveMain = serveStatic('dist');
const mainDev = (req, res) => {
  return () => {
    const index = path.join('dist', 'index.html');
    fs.readFile(index, 'utf8', (err, data) => {
      if (err) {
        res.status(500).send({
          error: 'Unable to read index file',
        });
      } else {
        res.set('Content-Type', 'text/html');
        res.send(data);
      }
    });
  };
};

app.get('*', (req, res) => {
  console.log('req.url', req.url);
  if (req.url === `/${modelFile}`) {
    modelRoute(modelFile, res);
    return;
  }
  serveMain(req, res, mainDev(req, res));
});

if (!modelExists(modelFile)) {
  // TODO: Build model.
  // Until the model is available the www renders LP with "processing" information.
  logger.info(`processing API file: ${modelFileLocation}`);
  const parser = new ApiParser(modelFileLocation);
  parser.run();
}

const server = app.listen(config.get('PORT'), () => {
  const { port } = server.address();
  /* eslint-disable-next-line no-console */
  console.log(`App listening on port ${port}`);
});
