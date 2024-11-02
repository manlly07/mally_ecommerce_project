import { Module } from '@nestjs/common';
import { SpusService } from './spus.service';
import { SpusController } from './spus.controller';
import { SpusRepository } from 'src/repositories/spus.repository';
import { UsersService } from '../users/users.service';
import { SkusService } from '../skus/skus.service';
import { UsersModule } from '../users/users.module';
import { SkusModule } from '../skus/skus.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Spu, SpuSchema } from 'src/schemas/spus.schema';
import { SkusRepository } from 'src/repositories/skus.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Spu.name, schema: SpuSchema }]), 
    UsersModule,
    SkusModule
  ],
  providers: [SpusService, SpusRepository],
  controllers: [SpusController]
})
export class SpusModule {}
