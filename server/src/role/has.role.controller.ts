import { Body, Controller, Get, Param, Post, Put, Delete, BadRequestException, Patch, UseGuards, InternalServerErrorException } from '@nestjs/common';
import { Roles } from 'src/decorator/roles.decorator';
import { HasRoleDto } from 'src/dto/has-role.dto';
import { Role, RoleName } from "../entities/has-role.entity"; 
import { User } from 'src/entities/user.entity';
import { HasRoleService } from './has-role.service';
import { Reflector } from '@nestjs/core';
import { HasRoleGuard } from 'src/guards/has-role.guard';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('roles')
export class RoleController {
  constructor(private roleService: HasRoleService) {}

  @Post()
    async createRole(@Body() role: Role): Promise<Role> {
    const roleDto = new HasRoleDto();
    roleDto.role = role.name;
    return this.roleService.create(roleDto);
}

  @Get()
  async findAllRoles(): Promise<Role[]> {
    return this.roleService.findAll();
  }

  @Get(':id')
  async findOneRole(@Param('id') id: number): Promise<Role> {
    return this.roleService.findOne({where: {id}});
  }

  @Put(':id')
async updateRole(@Param('id') id: number, @Body() role: Role): Promise<Role> {
  const allowedRoles = ["admin", "content manager", "standard"];
  if (!allowedRoles.includes(role.name)) {
    throw new BadRequestException("Invalid role name");
  }
  const roleDto = new HasRoleDto();
  roleDto.role = role.name;
  return this.roleService.update(id, roleDto);
}

  @Delete(':id')
  async deleteRole(@Param('id') id: number): Promise<void> {
    return this.roleService.delete(id);
  }

  @Post('/init-default-roles')
async initDefaultRoles(): Promise<string> {
  return this.roleService.initDefaultRoles();
}

@Patch('update-user-role-by-email')
@UseGuards(new HasRoleGuard(['superadmin','admin'] as RoleName[]))
async updateUserRoleByEmail(
  @Body('email') email: string,
  @Body('newRoleName') newRoleName: RoleName
): Promise<User> {
  return this.roleService.updateUserRoleByEmail(email, newRoleName);
}


@Post('/register')
@UseGuards(new HasRoleGuard(['superadmin'] as RoleName[]))
async register(
  @Body('email') email: string,
  @Body('password') password: string,
  @Body('role') role: RoleName = 'admin',
) {
  const existingUser = await this.roleService.getUserByEmail(email);
  if (existingUser) {
    throw new BadRequestException('User with that email already exists');
  }

  try {
    return await this.roleService.createAdmin(email, password);
  } catch (err) {
    // Handle the error
    console.error(err);
    throw new InternalServerErrorException('Failed to create user.');
  }
}


}
