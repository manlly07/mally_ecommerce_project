import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { KeysModule } from '../keys/keys.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    KeysModule
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
