import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { HasRoleDto } from "src/dto/has-role.dto";
import { Repository } from "typeorm";
import { Role, RoleName } from "../entities/has-role.entity";
import { User } from '../entities/user.entity';
import { FindOneOptions } from 'typeorm';


@Injectable()
export class HasRoleService {
  constructor(@InjectRepository(Role) private roleRepository: Repository<Role>,
  @InjectRepository(User) private userRepository: Repository<User>) {}

  async create(roleDto: HasRoleDto): Promise<Role> {
    const role = new Role();
    role.name = roleDto.role;
    role.description = `This role has ${roleDto.role} permissions`;
    return this.roleRepository.save(role);
  }

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  async findOne(options: FindOneOptions<Role>): Promise<Role> {
    return this.roleRepository.findOne(options);
  }
  

  async update(id: number, roleDto: HasRoleDto): Promise<Role> {
    const role = await this.roleRepository.findOne({where: { id: id }});
    role.name = roleDto.role;
    role.description = `This role has ${roleDto.role} permissions`;
    return this.roleRepository.save(role);
  }

  async findOneByName(name: RoleName): Promise<Role> {
    const role = await this.roleRepository.createQueryBuilder('role')
      .where('role.name = :name', { name })
      .getOne();
    if (!role) {
      throw new NotFoundException(`Role with name "${name}" not found`);
    }
    return role;
  }
  
  async initDefaultRoles(): Promise<string> {
    const defaultRoles: RoleName[] = ['admin', 'content manager', 'standard'];
  
    for (const roleName of defaultRoles) {
      const roleExists = await this.roleRepository.findOne({where: { name: roleName }});
      if (!roleExists) {
        const roleDto = new HasRoleDto();
        roleDto.role = roleName;
        await this.create(roleDto);
      }
    }
  
    return 'Default roles initialized';
  }
  

async updateUserRoleByEmail(email: string, newRoleName: RoleName): Promise<User> {
  const user = await this.userRepository.findOne({where: { email }});
  if (!user) {
    throw new NotFoundException(`User with email "${email}" not found`);
  }

  const newRole = await this.findOneByName(newRoleName);
  user.role = newRole;
  return this.userRepository.save(user);
}

async getUserByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({where:{ email }});
  }

  async delete(id: number): Promise<void> {
    await this.roleRepository.delete({ id: id });
  }

  async createAdmin(username: string, email: string, password: string): Promise<User> {
    const adminRole = await this.roleRepository.findOne({ where: { name: 'admin' } });
    const user = new User();
    user.username = username;
    user.email = email;
    user.password = password;
    user.role = adminRole;
    return this.userRepository.save(user);
  }
  
  async createUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
}
