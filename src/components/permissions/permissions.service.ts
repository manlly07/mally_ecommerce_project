import { Injectable } from '@nestjs/common';
import { PermissionsRepository } from 'src/repositories/permission.repository';

@Injectable()
export class PermissionsService {
    constructor(private permissionsRepository: PermissionsRepository) {}
    
    async findAllPermissions() {
        return this.permissionsRepository.findAll();
    }

    async createPermission(data: any) {
        return this.permissionsRepository.create({ data });
    }

    async createPermissions(data: any) {
        return this.permissionsRepository.createMany({ data });
    }

    async updatePermission(permission_id: string, data: any) {
        
        return this.permissionsRepository.update({ where: { 
            id: permission_id,
        }, data });

    }

    async deletePermission(permission_id: string) {
        return this.permissionsRepository.update({ where: { 
            id: permission_id,
        }, data: {
            is_deleted: true,
            deleted_at: new Date()
        }});
    }

    async findPermissionByName(permission_name: string) {
        return this.permissionsRepository.findByName(permission_name);
    }

    async findPermissionById(permission_id: string) {
        return this.permissionsRepository.findById({
            id: permission_id
        });
    }
}