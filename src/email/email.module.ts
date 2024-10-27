import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { UsersModule } from 'src/users/users.module';
import { KeysModule } from 'src/keys/keys.module';

@Module({
  imports: [
    UsersModule,
    KeysModule
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
