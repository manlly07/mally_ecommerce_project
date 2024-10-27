import { Injectable } from '@nestjs/common';
import { UserTokenType } from 'src/auth/auth.dto';
import prisma from 'src/connection/init.mysql';
@Injectable()
export class KeysService {
    async createUserToken(data: UserTokenType) {
        return await prisma.user_tokens.create({ data });
    }

    async findUserToken(conditions: Object) {
        return await prisma.user_tokens.findFirst({
            where: {
                ...conditions,
                is_active: true,
                expiration: {
                    gte: new Date(),
                }
            }
        });
    }

    async deleteUserToken(conditions: Object) {
        return await prisma.user_tokens.updateMany({
            where: {
                ...conditions,
                is_active: true,
            },
            data: {
                is_active: false,
            }
        });
    }
}
