import { Module } from '@nestjs/common';
import { KeysService } from './keys.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Keys, KeySchema } from 'src/schemas/key.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Keys.name,
        schema: KeySchema,
      }
    ]),
  ],
  providers: [KeysService],
  exports: [KeysService]
})
export class KeysModule {}
