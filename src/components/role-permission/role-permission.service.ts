import { BadGatewayException, Injectable } from '@nestjs/common';
import { PermissionsRepository } from 'src/repositories/permission.repository';
import { RolePermissionRepository } from 'src/repositories/rolePermission.repository';
import { RolesRepository } from 'src/repositories/roles.repository';

@Injectable()
export class RolePermissionService {
    constructor(
        private rolePermissionRepository: RolePermissionRepository,
        private rolesRepository: RolesRepository,
        private permissionsRepository: PermissionsRepository
    ) {}

    async assignRolePermission(data: any) {
        console.log(data)
        const { role_id, permission_id } = data;
        const foundRoleId = await this.rolesRepository.findById({
            id: role_id,
        });
        if (!foundRoleId) throw new BadGatewayException(`Role ${role_id} not found`);

        const foundPermissionId = await this.permissionsRepository.findById({
            id: permission_id
        });
        if (!foundPermissionId) throw new BadGatewayException(`Permission ${permission_id} not found`);

        return await this.rolePermissionRepository.create({ data });
    }

    async assignRolePermissions(data: any) {
        return await this.rolePermissionRepository.createMany({ data });
    }

    async getRolePermissions() {
        return await this.rolePermissionRepository.findAll();
    }

    async getPermissionByRole() {
        const roles = await this.rolesRepository.findAll({
            where: {
                is_deleted: false
            },
            include: {
                role_permissions: {
                    include: {
                        permission: true
                    }
                },
                created_at: false,
                updated_at: false,
                deleted_at: false
            }
        })

        return roles;
    }
}
