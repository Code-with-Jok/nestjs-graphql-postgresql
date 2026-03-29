import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import express from 'express';

const server = express();

async function createServer() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  await app.init();
}

let isAppInitialized = false;

export default async (req: any, res: any) => {
  if (!isAppInitialized) {
    await createServer();
    isAppInitialized = true;
  }
  server(req, res);
};
