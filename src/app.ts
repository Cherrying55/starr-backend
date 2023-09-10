import 'reflect-metadata';
import 'express-async-errors';
import express, { Express } from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import cartRouter from './routers/cart.router';
import creditRouter from './routers/creditcard.router';
import orderRouter from './routers/order.router';
import productRouter from './routers/product.router';
import userRouter from './routers/user.router';
import wishListRouter from './routers/wishlist.router';

export function loadEnv() {
  const path =
    process.env.NODE_ENV === 'test'
      ? '.env.test'
      : process.env.NODE_ENV === 'development'
      ? '.env.development'
      : '.env';

  const currentEnvs = dotenv.config({ path });
  dotenvExpand.expand(currentEnvs);
}

let prisma: PrismaClient;
function connectDb(): void {
  prisma = new PrismaClient();
}

async function disconnectDB(): Promise<void> {
  await prisma?.$disconnect();
}

import cors from 'cors';

loadEnv();

const app = express();
app.use(cors());
app.use(express.json()).get('/health', (_req, res) => res.send('OK!'));
app.use('/cart', cartRouter);
app.use('/credit', creditRouter);
app.use('/orders', orderRouter);
app.use('/products', productRouter);
app.use('/auth', userRouter);
app.use('/wishlist', wishListRouter);

export function init(): Promise<Express> {
  connectDb();
  return Promise.resolve(app);
}

export async function close(): Promise<void> {
  await disconnectDB();
}
export default app;
