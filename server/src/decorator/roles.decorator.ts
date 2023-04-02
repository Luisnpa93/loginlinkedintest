import { SetMetadata } from '@nestjs/common';
import { HasRoleDto } from 'src/dto/has-role.dto';

export const Roles = (role: HasRoleDto) => SetMetadata('role', role);
