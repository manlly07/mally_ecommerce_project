import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { JwtModule } from '@nestjs/jwt';

import * as dotenv from 'dotenv';
import { DatabaseProvider } from './common/connection/init.mongodb';
import { RequestInfoMiddleware } from './middlewares/info.middleware';
import { RolesModule } from './components/roles/roles.module';
import { UserRoleModule } from './components/user-role/user-role.module';
import { AuthModule } from './components/auth/auth.module';
import { UsersModule } from './components/users/users.module';
import { EmailModule } from './components/email/email.module';
import { KeysModule } from './components/keys/keys.module';
import { PrismaModule } from './common/connection/prisma/prisma.module';
import { PermissionsModule } from './components/permissions/permissions.module';
import { RolePermissionModule } from './components/role-permission/role-permission.module';
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
    RolesModule,
    UserRoleModule,
    PrismaModule,
    PermissionsModule,
    RolePermissionModule
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
