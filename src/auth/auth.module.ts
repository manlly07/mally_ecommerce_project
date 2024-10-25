import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { EmailModule } from 'src/email/email.module';
import { OtpModule } from 'src/otp/otp.module';

@Module({
    imports: [
        UsersModule, 
        EmailModule, 
        OtpModule,
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
