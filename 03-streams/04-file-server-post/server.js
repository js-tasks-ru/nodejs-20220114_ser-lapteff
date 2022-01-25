const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = http.createServer();

const limitMB = 1024 * 1024;

server.on('request', async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('Bad request');
        return;
      }

      fs.access(filepath, (err) => {
        if (!err) {
          res.statusCode = 409;
          res.end('File exist');
          return;
        }
        const limitedStream = new LimitSizeStream({limit: limitMB});
        const writeStream = fs.createWriteStream(filepath);

        req
            .pipe(limitedStream)
            .on('error', (err)=> {
              // console.log(err);
              if (err.code === 'LIMIT_EXCEEDED') {
                res.statusCode = 413;
                res.end(err.message);
                writeStream.destroy();
                fs.unlink(filepath, ()=>{});
              } else {
                console.error('Error:', e.message);
                res.statusCode = 500;
                res.end('Server error');
              }
            })
            .pipe(writeStream)
            .on('error', (err)=> {
              console.log(err.message);
            })
            .on('finish', ()=>{
              res.statusCode = 201;
              res.end('file saved');
            });

        req.on('aborted', () => {
          writeStream.destroy();
          fs.unlink(filepath, ()=>{});
        });
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
