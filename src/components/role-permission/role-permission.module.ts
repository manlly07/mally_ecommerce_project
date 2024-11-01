import { Module } from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { RolePermissionController } from './role-permission.controller';
import { RolePermissionRepository } from 'src/repositories/rolePermission.repository';
import { RolesRepository } from 'src/repositories/roles.repository';
import { PermissionsRepository } from 'src/repositories/permission.repository';

@Module({
  providers: [RolePermissionService, RolePermissionRepository, RolesRepository, PermissionsRepository],
  controllers: [RolePermissionController]
})
export class RolePermissionModule {}
