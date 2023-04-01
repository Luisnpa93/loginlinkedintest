import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { readFileSync } from 'fs';  
import { join } from 'path';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';


async function bootstrap() {
  config();
  //const keyFile = join(__dirname, '..', 'ssl', 'key.pem');
  //const certFile = join(__dirname, '..', 'ssl', 'cert.pem');
  const keyFile = join(__dirname, '..', 'ssl', 'localhost.key');
  const certFile = join(__dirname, '..', 'ssl', 'localhost.crt');
  const key = readFileSync(keyFile);
  const cert = readFileSync(certFile);
  const httpsOptions = { key, cert};//, passphrase: 'wdtest991' };
  const app = await NestFactory.create(AppModule, { httpsOptions });
  
  app.use(
    helmet.contentSecurityPolicy({
      reportOnly: false, // Add this line
      directives: {
        defaultSrc: ["'self'", 'https:'],
        imgSrc: ["'self'", 'https:', 'data:','localhost:3001'],
        connectSrc: ["'self'", 'https:'],
      },
    }),
  );
  
  app.enableCors({
    origin: 'https://localhost:3002',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.use(cookieParser());
  await app.listen(3001);
  console.log(`NestJS server is running on https://localhost:3001`);
}
bootstrap();
