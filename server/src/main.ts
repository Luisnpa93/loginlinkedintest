import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

config();

async function bootstrap() {
  console.log('Starting NestJS server...');

  try {
    const app = await NestFactory.create(AppModule, {
      httpsOptions: {
        key: readFileSync(join(__dirname, '..', 'src/certs', 'key.pem')),
        cert: readFileSync(join(__dirname, '..', 'src/certs', 'cert.pem')),
        passphrase: 'wdtest991'
      },
      
    });

    await app.listen(3000);

    console.log('NestJS server started successfully on port 3000');
  } catch (error) {
    console.error('Error starting NestJS server:', error);
  }
}

bootstrap();
