import fs from 'fs';

export function modelExists(modelFile) {
  return fs.existsSync(modelFile);
}

export function modelRoute(modelFile, res) {
  if (!modelExists(modelFile)) {
    res.sendStatus(404);
  } else {
    fs.readFile(modelFile, 'utf8', (err, data) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.set('Content-Type', 'application/json')
        res.status(200).send(data);
      }
    });
  }
}
