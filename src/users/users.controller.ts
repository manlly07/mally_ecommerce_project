import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/guard/auth.guard';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {}
    @Post('me')
    async authenticated (user_id: number) {
        const user = await this.userService.findById(user_id)
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
}
