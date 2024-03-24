import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import fs from 'fs'
import express from 'express';
import https from 'https'

dotenv.config({ path: '.env' });

const app = express()
const options = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem')
}

app.use(cookieParser());

app.get('/', async (req,res) => {
  res.send('Hello World')
})

app.get('/set-cookie', async (req,res) => {
  res.cookie('token', '1234', {
    httpOnly: false,
    secure: true,
    sameSite: 'none'
  })
  res.send('Cookie set')
})

app.get('/main', async (req,res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>My App</title>
    </head>
    <script src="https://localhost:3001/script.js"></script>
    <body>
      <div id="app">Hello World</div>
    </body>
    </html>
  `);
})

const port = 3000
console.log(`Server is running on port https://localhost:${port}`)

const server = https.createServer(options, app)

server.listen(port)