import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import TemplateEmail from 'src/common/template';
import { replacePlaceHolder } from 'src/common/utils';
import { BaseEmail } from './email.dto';


import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CONSTANT } from 'src/common/constant';

@Injectable()
export class EmailService {
    constructor(
        private readonly mailService: MailerService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async generateTokenRandom(user_email: string ) {
        const token = await this.jwtService.signAsync({ user_email }, {
            expiresIn: CONSTANT.OTP_EXPIRATION,
            secret: this.configService.get('SECRET_KEY_OTP'),
        });
        return token;
    }

    async verifyToken(token: string) {
        try {

            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get('SECRET_KEY_OTP'),
            });
            return payload;
            
        } catch (error) {
            throw new UnauthorizedException('Token invalid');
        }
    }

    async sendEmailToken(email : string) {
        const token = await this.generateTokenRandom(email);
        const template = TemplateEmail.htmlEmailToken();

        const content = replacePlaceHolder(template, {
            link_verify: `http://localhost:8080/auth/verify?token=${token}`,
        });
    
        this.sendEmailBase({
            toEmail: email,
            subject: 'Vui lòng xác nhận địa chỉ email đăng ký Shopping!',
            text: 'Xác nhận email',
            template: content,
        })

        return true;
    }

    async sendEmailBase({ toEmail, subject, text, template } : BaseEmail) {
        const mailOptions = {
            from: ' "Shop" <dvc.290603@gmail.com> ',
            to: toEmail,
            subject,
            text,
            html: template,
        }
        this.mailService.sendMail(mailOptions)
        .then(() => {
            console.log('Email sent to: ' + toEmail);
        })
        .catch((error) => {
            console.log('Error sending email: ' + error);
        });
    }
    
    async verifyEmail(email: string, password: string) {
        

        const template = TemplateEmail.htmlEmailPassword();

        const content = replacePlaceHolder(template, {
            my_password: password,
        });

        this.sendEmailBase({
            toEmail: email,
            subject: 'Mật khẩu tài khoản Shopping!',
            text: 'Mật khẩu tài khoản',
            template: content,
        })

        return true;
    }
}
