import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PermissionsService } from './permissions.service';

@Controller('permissions')
export class PermissionsController {
    constructor(private permissionsService: PermissionsService) {}

    @Get()
    async getPermissions(): Promise<any> {
        return this.permissionsService.findAllPermissions();
    }

    @Get(':permissions_id')
    async findPermissionById(@Param('permissions_id') permission_id: string): Promise<any> {
        return this.permissionsService.findPermissionById(permission_id);
    }

    @Post()
    async createPermission(@Body() data: any): Promise<any> {
        return this.permissionsService.createPermission(data);
    }

    @Post('many')
    async createPermissions(@Body() data: any): Promise<any> {
        return this.permissionsService.createPermissions(data);
    }

    @Put(':permissions_id')
    async updatePermission(@Param('permissions_id') permission_id: string, @Body() data: any): Promise<any> {
        return this.permissionsService.updatePermission(permission_id, data);
    }

    @Delete(':permissions_id')
    async deletePermission(@Param('permissions_id') permission_id: string): Promise<any> {
        return this.permissionsService.deletePermission(permission_id);
    }

}
