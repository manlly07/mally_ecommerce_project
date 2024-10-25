import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import TemplateEmail from 'src/common/template';
import { replacePlaceHolder } from 'src/common/utils';
import { BaseEmail } from './email.dto';
import { UsersService } from 'src/users/users.service';


import { KeysService } from 'src/keys/keys.service';

@Injectable()
export class EmailService {
    constructor(
        private readonly mailService: MailerService,
    ) {}

    async sendEmailToken(email : string, otpToken : string) {

        const template = TemplateEmail.htmlEmailToken();

        const content = replacePlaceHolder(template, {
            link_verify: `http://localhost:8080/auth/verify?token=${otpToken}`,
        });
    
        this.sendEmailBase({
            toEmail: email,
            subject: 'Vui lòng xác nhận địa chỉ email đăng ký Shopping!',
            text: 'Xác nhận email',
            template: content,
        })

        return 1;
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
