import path from 'path';
import nconf from 'nconf';

nconf
  // 1. Command-line arguments
  .argv()
  // 2. Environment variables
  .env([
    'API_PROJECT',
    'API_TYPE',
    'API_MIME',
    'GA_ID'
  ])
  // 3. Config file
  .file({ file: path.join(__dirname, 'config.json') })
  // 4. Defaults
  .defaults({
    PORT: 8080
  });

export default nconf;

function checkConfig(setting) {
  if (!nconf.get(setting)) {
    throw new Error(`You must set ${setting} as an environment variable or in config.json!`);
  }
}

// Check for required settings
checkConfig('API_PROJECT');
checkConfig('API_TYPE');
