import { BadRequestException, Injectable, Redirect } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { EmailService } from 'src/email/email.service';

import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { LoginType } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import { CONSTANT } from 'src/common/constant';
import { generateToken, getSelectData, getSelectDataFromObject, unGetSelectData } from 'src/common/utils';
import { KeysService } from 'src/keys/keys.service';

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

    async login(data: LoginType): Promise<any> {
        const { email, password } = data;

        const findUser = await this.userService.findByEmail(email);
        if(!findUser) throw new BadRequestException('User not registered');

        const isMatch = await bcrypt.compare(password, findUser.user_password);
        if(!isMatch) throw new BadRequestException('Invalid password');

        const publicKey = randomBytes(64).toString('hex');
        const privateKey = randomBytes(64).toString('hex');

        const payload = {
            user_id: findUser.user_id,
            email,
        }
        
        // checked already logged in user
        const checkUserToken = await this.keyService.findUserToken({
            user_id: findUser.user_id,
            user_agent: data.user_agent,
            user_login_ip: data.user_login_ip,
        });

        if(checkUserToken) {
            console.log("You have logged in!")
            Redirect('https://google.com')
            return
        };

        const refreshToken = await generateToken(payload, privateKey, CONSTANT.REFRESH_TOKEN_EXPIRATION);
        const accessToken = await generateToken(payload, publicKey, CONSTANT.ACCESS_TOKEN_EXPIRATION);

        const keys = await this.keyService.createUserToken({
            user_id: findUser.user_id,
            user_agent: data.user_agent,
            user_login_ip: data.user_login_ip,
            user_private_key: privateKey,
            user_public_key: publicKey,
            user_refresh_token: refreshToken,
            expiration: new Date(new Date().getTime() + parseInt(CONSTANT.REFRESH_TOKEN_EXPIRATION) * 24 * 60 * 60 * 1000 ),
        })

        if(!keys) throw new BadRequestException('Login failed! Please try again');

        return {
            user_id: findUser.user_id,
            accessToken,
            refreshToken
        };
    }

    async logout(refreshToken: string){
        const findUserToken = await this.keyService.findUserToken({ user_refresh_token: refreshToken });
        if(!findUserToken) throw new BadRequestException('User not found');

        const deleteToken = await this.keyService.deleteUserToken({ user_refresh_token: refreshToken });
        if(!deleteToken) throw new BadRequestException('Logout failed! Please try again');

        return true;

    }
}
