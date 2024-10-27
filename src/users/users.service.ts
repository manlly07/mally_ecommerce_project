import { Injectable } from '@nestjs/common';
import { unGetSelectDataFromObject } from 'src/common/utils';
import prisma from 'src/connection/init.mysql'
@Injectable()
export class UsersService {

    async findByEmail(user_email: string) {
        return await prisma.users.findUnique({
            where: {
                user_email: user_email
            },
        });
    }

    async create({ user_email, user_role, user_password, user_salt }) {
        const newUser = prisma.users.create({
            data: {
                "user_password": user_password,
                "user_salt": user_salt,
                "user_email": user_email,
                // "user_role": usr_role,
            }
        });
        return newUser;
    }

    async findById(user_id: number) {
        const user = await prisma.users.findFirst({
            where: {
                user_id: user_id
            }
        });
        return unGetSelectDataFromObject(user, ['user_password', 'user_salt', 'created_at', 'updated_at']);
    }

    async update(user_id: number, data: any) {
        const user = await prisma.users.update({
            where: {
                user_id: user_id
            },
            data: data
        });
        return unGetSelectDataFromObject(user, ['user_password', 'user_salt', 'created_at', 'updated_at']);
    }

    async getUsers() {
        const users = await prisma.users.findMany();
        return users.map(user => unGetSelectDataFromObject(user, ['user_password', 'user_salt', 'created_at', 'updated_at']));
    }
}
