
import express from 'express';
import fs from 'fs'
import https from 'https'

const app = express();

const options = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem')
};

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://localhost:3000'); // CORSヘッダー
  res.header('Access-Control-Allow-Credentials', 'true'); // クレデンシャル付きのリクエストを許可
  next();
});

app.get('/script.js', (req, res) => {
  res.type('.js');
  res.send(`
    console.log('This script is loaded from an external server on localhost:3001');
  `);
});

const server = https.createServer(options, app);

server.listen(3001, () => {
  console.log('Server running on https://localhost:3001');
});