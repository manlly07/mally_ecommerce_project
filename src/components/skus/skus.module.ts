import { Module } from '@nestjs/common';
import { SkusService } from './skus.service';
import { SkusController } from './skus.controller';
import { SkusRepository } from 'src/repositories/skus.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Sku, SkuSchema } from 'src/schemas/skus.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sku.name, schema: SkuSchema }]), // Đăng ký schema Sku
  ],
  providers: [SkusService, SkusRepository],
  controllers: [SkusController],
  exports: [SkusService]
})
export class SkusModule {}
