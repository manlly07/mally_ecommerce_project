import { Injectable } from '@nestjs/common';
import { SkusRepository } from 'src/repositories/skus.repository';

@Injectable()
export class SkusService {
    constructor(private skusRepository: SkusRepository) {}

    async findAll() {
        return await this.skusRepository.findAll();
    }

    async create(data: any) {
        return await this.skusRepository.create(data);
    }

    async createMany(data: any) {
        return await this.skusRepository.createMany(data);
    }
}
