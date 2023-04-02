import { Body, Controller, Get, Param, Post, Put, Delete, BadRequestException } from '@nestjs/common';
import { HasRoleDto } from 'src/dto/has-role.dto';
import { Role } from 'src/entities/has-role.entity';
import { HasRoleService } from './has-role.service';


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
    return this.roleService.findOne(id);
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
}
