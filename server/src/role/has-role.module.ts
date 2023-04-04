import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../entities/has-role.entity';
import { RoleController } from './has.role.controller';
import { HasRoleService } from './has-role.service';
import { UserModule } from 'src/user/user-profile.module';
import { User } from 'src/entities/user.entity';
import { Reflector } from '@nestjs/core';
import { ROLES } from '../constants/has-roles.constants';


@Module({
  imports: [
    TypeOrmModule.forFeature([Role, User,]),
  ],
  controllers: [RoleController],
  providers: [HasRoleService, Reflector, {
    provide: 'ROLES',
    useValue: ['superadmin', 'admin', 'content manager'],
  }],
  exports: [HasRoleService, Reflector],
})
export class HasRoleModule {}
