import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserProfile } from './entities/user-profile.entity';
import { UserModule } from './user/user-profile.module';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    RedisModule.forRoot({
      config: {
        host: 'localhost', 
        port: 6379, 
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'wdtest',
      password: 'wdtest991',
      database: 'wdt',
      entities: [User, UserProfile],
      synchronize: true,
    }),
  ],
  controllers: [AppController ],
  providers: [AppService ],
})
export class AppModule {}