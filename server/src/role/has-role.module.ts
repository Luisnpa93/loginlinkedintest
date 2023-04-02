import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../entities/has-role.entity';
import { RoleController } from './has.role.controller';
import { HasRoleService } from './has-role.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RoleController],
  providers: [HasRoleService],
  exports: [HasRoleService],
})
export class HasRoleModule {}
