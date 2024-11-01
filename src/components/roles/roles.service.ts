import { BadRequestException, Injectable } from '@nestjs/common';
import prisma from 'src/common/connection/init.mysql';
import { RolesRepository } from 'src/repositories/roles.repository';
@Injectable()
export class RolesService {
    constructor(private rolesRepository: RolesRepository) {}

    async findAllRoles() {
        return this.rolesRepository.findAll();
    }

    async createRole(data: any) {
        const foundRole = await this.rolesRepository.findByName(data.role_name)
        if(foundRole) throw new BadRequestException('Role already exists');

        return this.rolesRepository.create({ data });
    }

    async updateRole(role_id: string, data: any) {
        
        return this.rolesRepository.update({ where: { 
            id: role_id,
        }, data });
        
    }

    async deleteRole(role_id: string, condition: Object) {
        return this.rolesRepository.update({ where: { 
            id: role_id,
            ...condition
        }, data: {
            is_deleted: true,
            deleted_at: new Date()
        }});
    }
}
