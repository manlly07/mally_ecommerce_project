import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { OtpService } from 'src/otp/otp.service';
import { OtpModule } from 'src/otp/otp.module';
import { UsersModule } from 'src/users/users.module';
import { KeysModule } from 'src/keys/keys.module';

@Module({
  imports: [
    OtpModule,
    UsersModule,
    KeysModule
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
