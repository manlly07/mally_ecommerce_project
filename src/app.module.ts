import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';

import { DatabaseProvider } from './connection/init.mongodb';
import * as dotenv from 'dotenv';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { OtpModule } from './otp/otp.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { KeysModule } from './keys/keys.module';
import { JwtModule } from '@nestjs/jwt';
dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env', 
    }),

    MailerModule.forRoot({
      transport: {
        host: String(process.env.MAIL_HOST),
        port: Number(process.env.MAIL_PORT),
        secure: false,
        service: 'Gmail',
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
    }),

    JwtModule.register(
      {
        global:true,
      }
    ),

    DatabaseProvider,
  
    UsersModule,
    AuthModule,
    EmailModule,
    OtpModule,
    KeysModule,
  ],
})
export class AppModule {}
