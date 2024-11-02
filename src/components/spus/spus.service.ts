import { Injectable, NotFoundException } from '@nestjs/common';
import { TSPU } from 'src/common/dto/spu.dto';
import { UsersService } from '../users/users.service';
import { SpusRepository } from 'src/repositories/spus.repository';
import { SkusService } from '../skus/skus.service';
import { randomUUID } from 'crypto';

@Injectable()
export class SpusService {
    constructor(
        private spusRepository: SpusRepository,
        private userService: UsersService,
        private skuService: SkusService,
    ) {}

    async findAll() {
        return await this.spusRepository.findAll();
    }

    async create(dto: TSPU) {
        const foundShop = await this.userService.findById({
            user_id: dto.product_shop,
        });

        if(!foundShop) throw new NotFoundException('Shop not found');

        const newSpu = await this.spusRepository.create(dto);

        if(newSpu && dto.sku_list.length > 0) {
            const convertSkuList = dto.sku_list.map(sku => {
                return {
                    ...sku,
                    product_id: newSpu.product_id,
                    sku_id: randomUUID()
                }
            });

            await this.skuService.createMany(convertSkuList);
        }

        return !!newSpu;
    }

}
