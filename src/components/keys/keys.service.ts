import { Injectable } from '@nestjs/common';
import prisma from 'src/common/connection/init.mysql';
import { UserTokenType } from '../auth/auth.dto';
import { KeysRepository } from 'src/repositories/keys.repository';
@Injectable()
export class KeysService {
    constructor(private keysRepository: KeysRepository) {}

    async createUserToken(data: UserTokenType) {
        return await this.keysRepository.create({ data });
    }

    async findUserToken(conditions: Object) {
        console.log(conditions)
        return await this.keysRepository.findFirst({
            where: {
                ...conditions,
                is_active: true,
                expiration: {
                    gte: new Date(),
                }
            },
            include: {
                user: true
            }
        });
    }

    async deleteUserToken(conditions: Object) {
        return await this.keysRepository.updateMany({
            where: {
                ...conditions,
                is_active: true,
            },
            data: {
                is_active: false,
            }
        });
    }

    async update(params: {
        where: Object,
        data: Object
    }) {
        return await this.keysRepository.update(params);
    }
}
