import { Injectable } from '@nestjs/common';
import prisma from 'src/common/connection/init.mysql';
@Injectable()
export class UserRoleService {

    async getRoles() {
        return prisma.user_role.findMany();
    }

    async assignRole(user_id: string, role_id: string) {
        return prisma.user_role.create({
        data: {
            user_id,
            role_id,
        },
        });
    }

    async removeRole(user_id: string, role_id: string) {
        return prisma.user_role.deleteMany({
        where: {
            user_id,
            role_id,
        },
        });
    }
}
