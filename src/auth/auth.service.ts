import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { EmailService } from 'src/email/email.service';
import { OtpService } from 'src/otp/otp.service';

import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { LoginType } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import { CONSTANT } from 'src/common/constant';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly emailService: EmailService,
        private readonly otpService: OtpService,
        private readonly jwtService: JwtService

    ) {}
    async register(usr_email: string) {
        
        // check if user exists
        const findUser = await this.userService.findByEmail(usr_email);

        if(findUser) {
            throw new BadRequestException('User already exists');
        };

        const token = await this.otpService.create( usr_email );


        const result = await this.emailService.sendEmailToken(usr_email, token.otp_token);
        return {
            message: 'verify email user',
        };
    }

    async verifyEmail(token: string): Promise<boolean> {
        const findToken = await this.otpService.checkEmailToken(token);
        if(!findToken) throw new BadRequestException('Token not found');

        const salt = await bcrypt.genSalt();
        const password = await bcrypt.hash(findToken.otp_email, salt); 

        const newUser = await this.userService.create({
            usr_email: findToken.otp_email,
            usr_password: password,
            usr_role: 'user',
            usr_salt: salt,
        });

        if(!newUser) throw new BadRequestException('Create user failed! Please try again');

        // const keyStore = await this.keysService.create({
        //     userId: newUser._id,
        //     refreshTokensUsed: [],
        //     refreshToken: '',
        //     publicKey: randomBytes(64).toString('hex'),
        //     privateKey: randomBytes(64).toString('hex'),
        // })
        this.emailService.verifyEmail(findToken.otp_email, password);

        return true;
    }

    async login(data: LoginType): Promise<any> {
        const { email, password } = data;

        const findUser = await this.userService.findByEmail(email);
        if(!findUser) throw new BadRequestException('User not registered');

        const isMatch = await bcrypt.compare(password, findUser.usr_password);
        if(!isMatch) throw new BadRequestException('Invalid password');

        const publicKey = randomBytes(64).toString('hex');
        const privateKey = randomBytes(64).toString('hex');

        const payload = {
            usr_id: findUser._id,
            email,
        }

        const token = await this.jwtService.signAsync(payload, {
            secret: publicKey,
            expiresIn: CONSTANT.ACCESS_TOKEN_EXPIRATION,
        })


        // const keyStore = await this.keysService.create({
        //     userId: findUser._id,
        //     refreshTokensUsed: [],
        //     refreshToken: '',
        //     publicKey: randomBytes(64).toString('hex'),
        //     privateKey: randomBytes(64).toString('hex'),
        // })
        return token;
    }
}
