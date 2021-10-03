const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);
  if (pathname.includes('/')) {
    res.statusCode = 400;
    res.end('included paths not supported');
    return;
  }


  switch (req.method) {
    case 'GET':
      const readStream = fs.createReadStream(filepath);
      readStream.pipe(res);
      res.statusCode = 200;

      readStream.on('error', (error) => {
        if (error.code ==='ENOENT') {
          res.statusCode = 404;
          res.end('file not found');
          return;
        }

        res.statusCode = 500;
        res.end('internal error');
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
