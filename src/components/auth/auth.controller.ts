import { BadRequestException, Body, Controller, Get, Ip, Post, Query, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginType } from './auth.dto';
import { Request, response, Response } from 'express';
import { CONSTANT } from 'src/common/constant';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    async register(@Body('user_email') user_email: string) {
        return this.authService.register(user_email);
    }

    @Get('verify')
    async verify(@Query('token') token: string) {
        return this.authService.verifyEmail(token);
    }
    // 
    @Post('login')
    async login(@Body() data: LoginType, @Req() request: Request, @Res() response: Response) {
        data.user_login_ip = request.ip; 
        data.user_agent = request.get('user-agent');
        return await this.authService.login(data, response);
    }

    @Post('logout')
    async logout(@Req() request: Request, @Res() response: Response) {
        const refreshToken = request.cookies['refresh_token'];

        if(!refreshToken) throw new BadRequestException('Something went wrong!');

        await this.authService.logout(refreshToken);
        response.clearCookie('refreshToken');

        return response.json(true);
    }
}
