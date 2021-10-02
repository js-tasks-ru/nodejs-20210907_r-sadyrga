const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('../01-limit-size-stream/LimitSizeStream');

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
    case 'POST':
      const writeStream = fs.createWriteStream(filepath, {flags: 'wx'});
      const limitSizeStream = new LimitSizeStream({limit: 1000000});
      const removeFile = () => fs.unlink(filepath, () => {});

      writeStream.on('finish', () => {
        res.statusCode = 201;
        res.end('file saved');
      });

      writeStream.on('error', (error) => {
        if (error.code === 'EEXIST') {
          res.statusCode = 409;
          res.end('file already exist');
          return;
        }

        res.statusCode = 500;
        res.end('internal error');
      });

      limitSizeStream.on('error', (error) => {
        if (error.code === 'LIMIT_EXCEEDED') {
          res.statusCode = 413;
          res.end('file is bigger than 1 mb');
        } else {
          res.statusCode = 500;
          res.end('internal error');
        }

        writeStream.destroy();
        removeFile();
      });


      req.on('aborted', () => {
        limitSizeStream.destroy();
        writeStream.destroy();
        removeFile();
      });

      req.pipe(limitSizeStream).pipe(writeStream);
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
