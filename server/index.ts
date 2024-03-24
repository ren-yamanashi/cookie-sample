import dotenv from 'dotenv';
import { Hono } from 'hono';
import { sign } from 'jsonwebtoken';
import {zValidator} from '@hono/zod-validator'
import { z } from 'zod'
import { users } from '../db/user';
import { getCookie, setCookie } from 'hono/cookie';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server'
import { Book, books } from '../db/book';
import jwt from 'jsonwebtoken';

dotenv.config({ path: '.env' });

const app = new Hono()
const userInfos: {[key:string]: {isAuthenticated: boolean, books:Book[]}} = {}

app.use(
  '*',
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);

app.get('/books', async (c) => {
  let token = getCookie(c, 'token');
  if(!token) {
    // NOTE: 新しいtokenを発行する
    const secret = process.env.JWT_SECRET_KEY
    if (!secret) {
      c.status(500)
      return c.json({error: 'Internal server error'})
    }
    token = jwt.sign({timestamp: Date.now()} , secret);
    setCookie(c, 'token', token, {
      httpOnly: false,
      secure: false,
    })
    userInfos[token] = {isAuthenticated: false, books: []}
  }

  const userInfo = userInfos[token]
  c.status(200)
  return c.json(userInfo)
})

app.post('/books',zValidator('json', z.object({
  title: z.string(),
})), async (c) => {
  const { title } = c.req.valid('json')
  const targetBook = books.find(b => b.title === title)
  if(!targetBook) {
    c.status(404)
    return c.json({error: 'Book not found'})
  }

  let token = getCookie(c, 'token');
  if(!token) {
    // NOTE: 新しいtokenを発行する
    const secretKey = process.env.JWT_SECRET_KEY
    const secret = process.env.JWT_SECRET_KEY
    if (!secret) {
      c.status(500)
      return c.json({error: 'Internal server error'})
    }
    token = jwt.sign({timestamp: Date.now()} , secret);
    setCookie(c, 'token', token, {
      httpOnly: false,
      secure: false,
    })
    userInfos[token] = {isAuthenticated: false, books: []}
  }
  if(!userInfos[token]) {
    userInfos[token] = {isAuthenticated: false, books: []}
  }

  const userInfo = userInfos[token]
  userInfo.books.push(targetBook)
  c.status(200)
  return c.json(userInfo)
})

app.post('/checkout',async (c) => {
  const token = getCookie(c, 'token');
  if (!token || !userInfos[token]) return c.text('Unauthorized', 401);

  const jwtSecretKey = process.env.JWT_SECRET_KEY;
  if (!jwtSecretKey) return c.text('Internal Server Error', 500);

  const userInfo = userInfos[token]
  if(userInfo.isAuthenticated) {
    userInfo.books = []
    c.status(200)
    return c.json({message: "Book checked out"})
  } else {
    // NOTE: 未検証の場合はリダイレクト
    c.status(402)
    return c.json({message: "Redirect to sign page"})
  }
})

app.post('/sign', zValidator('json', z.object({
  email: z.string(),
  password: z.string()
})), async (c) => {
  const { email, password } = c.req.valid('json')
  const user = users.find(u => u.email === email && u.password === password)
  if(!user) {
    c.status(404)
    return c.json({error: 'User not found'})
  }

  const jwtPayload = {
    id: user.id,
    email: user.email
  }

  let token = getCookie(c, 'token');
  if(!token) {
    const secret = process.env.JWT_SECRET_KEY
    if (!secret) {
      c.status(500)
      return c.json({error: 'Internal server error'})
    }
    token = sign(jwtPayload, secret)
    setCookie(c, 'token', token, {
      httpOnly: false,
      secure: false,
    })
    userInfos[token] = {isAuthenticated: true, books: []}
  }

  const userInfo = userInfos[token]
  userInfo.isAuthenticated = true

  c.status(200)
  return c.json(user)
})

const port = 3000
console.log(`Server is running on port http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
