import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { KeysModule } from './keys/keys.module';
import { JwtModule } from '@nestjs/jwt';

import * as dotenv from 'dotenv';
import { DatabaseProvider } from './connection/init.mongodb';
import { RequestInfoMiddleware } from './middlewares/info.middleware';
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
    KeysModule,

  ],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestInfoMiddleware)
      .forRoutes('*');
  }

}
