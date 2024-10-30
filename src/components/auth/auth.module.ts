import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { EmailModule } from '../email/email.module';
import { KeysModule } from '../keys/keys.module';
import { PrismaService } from 'src/common/connection/prisma/prisma.service';

@Module({
    imports: [
        UsersModule, 
        EmailModule, 
        KeysModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, PrismaService],
})
export class AuthModule {}
