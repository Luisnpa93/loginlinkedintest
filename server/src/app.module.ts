import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { UserProfileController } from './user/user-profile.controller';
import { UserProfileService } from './user/user-profile.service';
import { UserProfile } from './user/user-profile.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
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
    TypeOrmModule.forFeature([User, UserProfile]),
  ],
  controllers: [AppController, UserProfileController],
  providers: [AppService, UserProfileService],
})
export class AppModule {}