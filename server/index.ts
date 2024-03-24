import dotenv from 'dotenv';
import { Hono } from 'hono';
import { sign } from 'jsonwebtoken';
import {zValidator} from '@hono/zod-validator'
import { z } from 'zod'
import { users } from '../db/user';
import { setCookie } from 'hono/cookie';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server'
import {authCheck} from './middleware/authCheck'
import { books } from '../db/book';

dotenv.config({ path: '.env' });

const app = new Hono()

app.use(
  '*',
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);

app.get('/', (c) => {
  return c.text('Hello Hono!')}
)
app.get('/books',authCheck, (c) => {
  return c.json(books)
})

app.post('/sign', zValidator('json', z.object({
  email: z.string(),
  password: z.string()
})), async (c) => {
  const { email, password } = c.req.valid('json')
  const user = users.find(u => u.email === email && u.password === password)
  if(!user) {
    c.status(404)
    return c.text('User not found')
  }

  const jwtPayload = {
    id: user.id,
    email: user.email
  }

  const secret = process.env.JWT_SECRET_KEY
  if (!secret) {
    c.status(500)
    return c.text('Internal server error')
  }

  const token = sign(jwtPayload, secret, {
    expiresIn: '1h'
  })

  setCookie(c, 'token', token, {
    httpOnly: false,
    secure: false,
    expires: new Date(Date.now() + 3600000)
  })

  c.status(200)
  return c.json(user)
})


const port = 3000
console.log(`Server is running on port http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
