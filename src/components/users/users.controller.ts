import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { Permissions } from 'src/common/utils';
import { PermissionsGuard } from 'src/common/guard/permission.guard';

@UseGuards(AuthGuard, PermissionsGuard)
@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {}
    
    @Post('me')
    @Permissions('View Orders',)
    async authenticated (@Body('user_id') user_id: string) {
        const user = await this.userService.findById({user_id})
        return user
    }

    @Post('update')
    async update(@Body() data: any) {
        console.log(data)
        const { user_id, ...rest } = data
        const user = await this.userService.update(user_id, rest)
        return user
    }

    @Post('')
    async getUsers() {
        const users = await this.userService.getUsers()
        return users
    }

    @Post('authorize')
    async userHasPermission(@Body() data: any) {
        const { user_id, permission } = data
        const hasPermission = await this.userService.userHasPermission(user_id, permission)
        return hasPermission
    }

}
