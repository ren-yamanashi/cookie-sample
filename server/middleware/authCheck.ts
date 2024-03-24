import { Context, Env, Next } from 'hono';
import { getCookie } from 'hono/cookie';
import { verify } from "jsonwebtoken";

export async function authCheck(c: Context<Env, '/', {}>, next: Next) {
  const token = getCookie(c, 'token');
  if (!token) return c.text('Unauthorized', 401);

  const jwtSecretKey = process.env.JWT_SECRET_KEY;
  if (!jwtSecretKey) return c.text('Internal Server Error', 500);

  verify(token, jwtSecretKey);

  await next();
}
