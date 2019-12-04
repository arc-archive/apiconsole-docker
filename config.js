import path from 'path';
import nconf from 'nconf';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const configFile = IS_PRODUCTION ? 'config.json' : 'dev-config.json';

nconf
  // 1. Command-line arguments
  .argv()
  // 2. Environment variables
  .env([
    'API_PROJECT',
    'API_TYPE',
    'API_MIME',
    'PORT',
    'NODE_ENV',
  ])
  // 3. Config file
  .file({ file: path.join(__dirname, configFile) })
  // 4. Defaults
  .defaults({
    PORT: 8080
  });

export default nconf;

function checkConfig(setting) {
  if (!nconf.get(setting)) {
    let msg = `You must set ${setting} as an environment variable or in config.json.\n`;
    msg += `Visit https://docs.api-console.io/ for more information.`;
    throw new Error(msg);
  }
}
// Check for required settings
checkConfig('API_PROJECT');
// checkConfig('API_TYPE');
