import { Role } from './entities/has-role.entity';
import { User } from './entities/user.entity';
import { AuthService } from './auth/auth.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Connection } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserProfileService } from './user/user-profile.service';

@Injectable()
export class CreateSuperadminCommand {
  constructor(
    private readonly authService: AuthService,
    private readonly connection: Connection,
    private readonly userProfileService: UserProfileService,
  ) {}

  async execute(): Promise<void> {
    // Check if superadmin user already exists
    const adminUser = await this.userProfileService.getUserByProp('email', 'superadmin@example.com');
    if (adminUser) {
      console.log('Super Admin user already exists');
      return;
    }
  
    // Create super admin role if it doesn't exist
    const roleRepository = this.connection.getRepository(Role);
    let adminRole = await roleRepository.findOne({ where: { name: 'superadmin' } });
    if (!adminRole) {
      const newRole = new Role();
      newRole.name = 'superadmin';
      newRole.description = 'This role has superadmin permissions';
      adminRole = await roleRepository.save(newRole);
    }
  
    // Create admin user
    const newUser = new User();
    newUser.email = 'superadmin@example.com';
    newUser.password = 'testtest'
    newUser.role = adminRole;
  
    await this.authService.create(newUser);
  
    console.log('Super Admin user created');
  }
  
  
}
