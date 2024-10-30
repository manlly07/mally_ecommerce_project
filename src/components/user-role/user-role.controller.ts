import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserRoleService } from './user-role.service';

@Controller('user-role')
export class UserRoleController {
    constructor(private userRoleService: UserRoleService) {}

    @Get()
    async getRoles() {
        return await this.userRoleService.getRoles()
    }

    @Post('assign')
    async assignRole(@Body('user_id') user_id: string, @Body('role_id') role_id: string) {
        return await this.userRoleService.assignRole(user_id, role_id) 
    }

    @Post('delete')
    async deleteRole(@Body('user_id') user_id: string, @Body('role_id') role_id: string) {
        return await this.userRoleService.removeRole(user_id, role_id)
    }
}
