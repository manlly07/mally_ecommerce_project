import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
    constructor(private rolesService: RolesService) {}

    @Get()
    async findAll() {
        return this.rolesService.findAllRoles();
    }

    @Post()
    async createRole(@Body() data: any) {
        return this.rolesService.createRole(data);
    }

    @Put(':role_id')
    async updateRole(@Param('role_id') role_id: string, @Body() data: any) {
        return this.rolesService.updateRole(role_id,  data);
    }

    @Delete(':role_id')
    async deleteRole(@Param('role_id') role_id: string) {
        const condition = {};
        return this.rolesService.deleteRole(role_id, condition);
    }
    
}

