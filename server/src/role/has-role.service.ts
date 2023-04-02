import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { HasRoleDto } from "src/dto/has-role.dto";
import { Repository } from "typeorm";
import { Role, RoleName } from "../entities/has-role.entity";

@Injectable()
export class HasRoleService {
  constructor(@InjectRepository(Role) private roleRepository: Repository<Role>) {}

  async create(roleDto: HasRoleDto): Promise<Role> {
    const role = new Role();
    role.name = roleDto.role;
    role.description = `This role has ${roleDto.role} permissions`;
    return this.roleRepository.save(role);
  }

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  async findOne(id: number): Promise<Role> {
    return this.roleRepository.findOne({where: { id: id }});
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
  
  
  
  async delete(id: number): Promise<void> {
    await this.roleRepository.delete({ id: id });
  }
}
