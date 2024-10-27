import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { EmailModule } from 'src/email/email.module';
import { KeysModule } from 'src/keys/keys.module';

@Module({
    imports: [
        UsersModule, 
        EmailModule, 
        KeysModule,
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
