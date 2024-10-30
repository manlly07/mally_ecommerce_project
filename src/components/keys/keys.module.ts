import { Module } from '@nestjs/common';
import { KeysService } from './keys.service';
import { KeysController } from './keys.controller';
import { KeysRepository } from 'src/repositories/keys.repository';

@Module({
  providers: [KeysService, KeysRepository],
  controllers: [KeysController],
  exports: [KeysService]
})
export class KeysModule {}
