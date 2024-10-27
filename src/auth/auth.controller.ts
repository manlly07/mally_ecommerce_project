import { BadRequestException, Body, Controller, Get, Ip, Post, Query, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginType } from './auth.dto';
import { Request, response, Response } from 'express';
import { CONSTANT } from 'src/common/constant';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    async register(@Body('email') email: string) {
        return this.authService.register(email);
    }

    @Get('verify')
    async verify(@Query('token') token: string) {
        return this.authService.verifyEmail(token);
    }

    @Post('login')
    async login(@Body() data: LoginType, @Req() request: Request, @Res() response: Response) {
        data.user_login_ip = request['user_ip']; 
        data.user_agent = request['user_agent'];

        const { user_id, accessToken, refreshToken} = await this.authService.login(data);
        
        response.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: parseInt(CONSTANT.REFRESH_TOKEN_EXPIRATION) * 24 * 60 * 60 * 1000,
        })
        return response.json({
            user_id,
            accessToken,
        })
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
