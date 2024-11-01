import { Body, Controller, Get, Post } from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';

@Controller('role-permission')
export class RolePermissionController {
    constructor(private rolePermissionService: RolePermissionService) {}

    @Post()
    async assignRolePermission(@Body() data: any) {
        return await this.rolePermissionService.assignRolePermission(data);
    }

    @Post('many')
    async assignRolePermissions(@Body() data: any) {
        return await this.rolePermissionService.assignRolePermissions(data);
    }

    @Get('permissionbyrole')
    async getPermissionByRole() {
        return await this.rolePermissionService.getPermissionByRole();
    }

    @Get()
    async getRolePermissions() {
        return await this.rolePermissionService.getRolePermissions();
    }
}
