import { Body, Controller, Get, Post } from '@nestjs/common';
import { SpusService } from './spus.service';
import { TSPU } from 'src/common/dto/spu.dto';

@Controller('spus')
export class SpusController {
    constructor(private spusService: SpusService) {}

    @Get()
    async findAll() {
        return "Find all"
    }

    @Post()
    async create(@Body() data: TSPU) {
        console.log(data)
        return await this.spusService.create(data);
    }
}
