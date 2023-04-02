import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserProfile } from './entities/user-profile.entity';
import { UserModule } from './user/user-profile.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { PasswordResetModule } from './password-reset/password-reset.module';
import { HasRoleModule } from './role/has-role.module';
import { Role } from './entities/has-role.entity';
import { HasRoleService } from './role/has-role.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    HasRoleModule,
    PasswordResetModule,
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
      entities: [User, UserProfile, Role],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AppController ],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly hasRoleService: HasRoleService) {}

  async onModuleInit() {
    await this.hasRoleService.initDefaultRoles();
  }
}