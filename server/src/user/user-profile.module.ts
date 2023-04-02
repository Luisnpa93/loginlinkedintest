import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserProfileService } from './user-profile.service';
import { UserProfileController } from './user-profile.controller';
import { UserProfile } from '../entities/user-profile.entity';
import { HasRoleModule } from 'src/role/has-role.module';
import { Role } from 'src/entities/has-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserProfile]),
],
  providers: [UserProfileService],
  controllers: [UserProfileController],
  exports: [UserProfileService],
})
export class UserModule {}