import { BadRequestException, Injectable, Redirect, UnauthorizedException } from '@nestjs/common';

import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { LoginType } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import { CONSTANT } from 'src/common/constant';
import { generateToken, getSelectData, getSelectDataFromObject, unGetSelectData } from 'src/common/utils';
import { UsersService } from '../users/users.service';
import { KeysService } from '../keys/keys.service';
import { EmailService } from '../email/email.service';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly emailService: EmailService,
        private readonly keyService: KeysService,
    ) {}
    async register(usr_email: string) {
        
        // check if user exists
        const findUser = await this.userService.findByEmail(usr_email);

        if(findUser) {
            throw new BadRequestException('User already exists');
        };

        const result = await this.emailService.sendEmailToken(usr_email);
        return {
            message: 'verify email user',
            result
        };
    }

    async verifyEmail(token: string): Promise<boolean> {
        const { user_email } = await this.emailService.verifyToken(token);
        console.log(user_email);
        
        const user = await this.userService.findByEmail(user_email);
        if(user) throw new BadRequestException('User already exists');
        
        const salt = await bcrypt.genSalt();
        const password = await bcrypt.hash(user_email, salt); 

        const newUser = await this.userService.create({
            user_email,
            user_password: password,
            user_role: 'user',
            user_salt: salt,
        });

        if(!newUser) throw new BadRequestException('Create user failed! Please try again');

        // const keyStore = await this.keysService.create({
        //     userId: newUser._id,
        //     refreshTokensUsed: [],
        //     refreshToken: '',
        //     publicKey: randomBytes(64).toString('hex'),
        //     privateKey: randomBytes(64).toString('hex'),
        // })
        this.emailService.verifyEmail(user_email, password);

        return true;
    }

    async login(data: LoginType, response: Response): Promise<any> {
        const { email, password } = data;

        const findUser = await this.userService.findByEmail(email);

        console.log(findUser);
        
        if(!findUser) throw new BadRequestException('User not registered');

        const isMatch = await bcrypt.compare(password, findUser.user_password);
        if(!isMatch) throw new BadRequestException('Invalid password');

        const publicKey = randomBytes(64).toString('hex');
        const privateKey = randomBytes(64).toString('hex');

        const payload = {
            user_id: findUser.id,
            email,
        }
        
        // checked already logged in user
        const checkUserToken = await this.keyService.findUserToken({
            user_id: findUser.id,
            user_agent: data.user_agent,
            user_login_ip: data.user_login_ip,
        });

        if(checkUserToken) {
            console.log("You have logged in!")
            // Redirect('https://google.com')
            return response.json({
                message: "You have logged in!"
            })
        };

        const refreshToken = await generateToken(payload, privateKey, CONSTANT.REFRESH_TOKEN_EXPIRATION);
        const accessToken = await generateToken(payload, publicKey, CONSTANT.ACCESS_TOKEN_EXPIRATION);

        const keys = await this.keyService.createUserToken({
            user_id: findUser.id,
            user_agent: data.user_agent,
            user_login_ip: data.user_login_ip,
            user_private_key: privateKey,
            user_public_key: publicKey,
            user_refresh_token: refreshToken,
            expiration: new Date(new Date().getTime() + parseInt(CONSTANT.REFRESH_TOKEN_EXPIRATION) * 24 * 60 * 60 * 1000 ),
        })

        if(!keys) throw new BadRequestException('Login failed! Please try again');

        response.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: parseInt(CONSTANT.REFRESH_TOKEN_EXPIRATION) * 24 * 60 * 60 * 1000,
        })
        return response.json({
            user_id: findUser.id,
            accessToken,
        })
    }

    async logout(refreshToken: string){
        const findUserToken = await this.keyService.findUserToken({ user_refresh_token: refreshToken });
        if(!findUserToken) throw new BadRequestException('User not found');

        const deleteToken = await this.keyService.deleteUserToken({ user_refresh_token: refreshToken });
        if(!deleteToken) throw new BadRequestException('Logout failed! Please try again');

        return true;

    }

    async refreshToken(refreshToken: string, response: Response, user_id: string) {
        const findUserToken = await this.userService.findById({
            user_id: user_id,
            include: {
                user_tokens: true
            }
        }) as any;
        if(!findUserToken) throw new BadRequestException('User not found');

        console.log(findUserToken)
        // check refreshToken cos trong findUserToken 
        const availableToken = findUserToken.user_tokens.find((token:any) => token.user_refresh_token === refreshToken);

        console.log(availableToken)

        if(!availableToken) throw new UnauthorizedException('Not authorized');

        if(!availableToken.is_active) {
            await this.userService.updateMany(user_id, {
                is_active: false,
            })

            throw new UnauthorizedException('Something went wrong! Please relogin your account');
        } 

        const payload = {
            user_id,
            email: findUserToken.user_email,
        }
        console.log(new Date(availableToken.expiration).getTime().toString());
        const { user_private_key: privateKey, user_public_key: publicKey } = availableToken;
        const newRefreshToken = (await generateToken(payload, privateKey, new Date(availableToken.expiration).getTime().toString()));
        const newAccessToken = await generateToken(payload, publicKey, CONSTANT.ACCESS_TOKEN_EXPIRATION);

        const updateToken = await this.keyService.update({
            where: {
                user_id: user_id,
                user_refresh_token: refreshToken,
            },
            data: {
                user_refresh_token: newRefreshToken,
            }
        })

        response.cookie('refresh_token', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: new Date(availableToken.expiration).getTime(),
        })

        return {
            user_id,
            accessToken: newAccessToken,
        }
        // const updateToken = await this.keyService.createUserToken({
        //     user_id: findUserToken.user_id,
        //     user_agent: findUserToken.user_agent,
        //     user_login_ip: findUserToken.user_login_ip,
        //     user_private_key: privateKey,
        //     user_public_key: publicKey,
        //     user_refresh_token: newRefreshToken,
        //     expiration: new Date(new Date().getTime() + parseInt(CONSTANT.REFRESH_TOKEN_EXPIRATION) * 24 * 60 * 60 * 1000 ),
        // })

        // if(!updateToken) throw new BadRequestException('Refresh token failed! Please try again');

        // response.cookie('refresh_token', newRefreshToken, {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: 'strict',
        //     maxAge: parseInt(CONSTANT.REFRESH_TOKEN_EXPIRATION) * 24 * 60 * 60 * 1000,
        // })
        // return response.json({
        //     user_id: findUserToken.user_id,
        //     accessToken: newAccessToken,
        // })
    }
}
