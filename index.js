'use strict';
const http = require('http');
const pug = require('pug');
const server = http
  .createServer((req, res) => {
    const now = new Date();
    console.info(`[${now}] Requested by ${req.socket.remoteAddress}`);
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8'
    });

    switch (req.method) {
      case 'GET':
        if (req.url === '/') {
          res.write(pug.renderFile('./home.pug'));
        } else if (req.url === '/enquetes') {
          res.write(pug.renderFile('./survey.pug'));
        } else if (req.url === '/enquetes/yaki-shabu') {
          res.write(pug.renderFile('./form.pug', {
            path: req.url,
            firstItem: '焼き肉',
            secondItem: 'しゃぶしゃぶ'
          }));
        } else if (req.url === '/enquetes/rice-bread') {
          res.write(pug.renderFile('./form.pug', {
            path: req.url,
            firstItem: 'ごはん',
            secondItem: 'パン'
          }));
        } else if(req.url === "/enquetes/sushi-pizza") {
          res.write(pug.renderFile('./form.pug', {
            path: req.url,
            firstItem: '寿司',
            secondItem: 'ピザ'
          }));
        }
        res.end();
        break;
      case 'POST':
        let rawData = '';
        req
          .on('data', chunk => {
            rawData += chunk;
          })
          .on('end', () => {
            const answer = new URLSearchParams(rawData);
            const message = `${answer.get('name')}さんは${answer.get('favorite')}に投票しました`;
            const backLink = `<a href="#" onclick="window.history.go(-2); return false;">アンケートに戻る</a>`
            const backgroundColor = `<style>body{background-color: rgb(204, 249, 149);}</style>`
            console.info(`[${now}] ${message}`);
            res.write(`<!DOCTYPE html><html lang="ja">
              <head>${backgroundColor}</head>
              <body><h1>${message}</h1><br>このアンケートの情報は記録されません<br>${backLink}</body>
              </html>`);
            res.end();
          });
        break;
      default:
        break;
    }
  })
  .on('error', e => {
    console.error(`[${new Date()}] Server Error`, e);
  })
  .on('clientError', e => {
    console.error(`[${new Date()}] Client Error`, e);
  });
const port = process.env.PORT || 8000;;
server.listen(port, () => {
  console.info(`[${new Date()}] Listening on ${port}`);
});
