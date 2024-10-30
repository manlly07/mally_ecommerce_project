import { Injectable } from '@nestjs/common';
import { unGetSelectDataFromObject } from 'src/common/utils';
import { UserRepository } from 'src/repositories/user.repository';
@Injectable()
export class UsersService {
    constructor( private userRepository: UserRepository ) {}
    
    async findByEmail(user_email: string) {
        return await this.userRepository.findByEmail(user_email);
    }

    async create({ user_email, user_role, user_password, user_salt }) {
        const newUser = this.userRepository.create({
            data: {
                "user_password": user_password,
                "user_salt": user_salt,
                "user_email": user_email,
                // "user_role": usr_role,
            }
        });
        return newUser;
    }

    async findById(user_id: string) {
        const user = await this.userRepository.findById({
            id: user_id
        });
        return unGetSelectDataFromObject(user, ['user_password', 'user_salt', 'created_at', 'updated_at']);
    }

    async update(user_id: string, data: any) {
        const user = await this.userRepository.update({
            where: {
                user_id
            },
            data: data
        });
        return unGetSelectDataFromObject(user, ['user_password', 'user_salt', 'created_at', 'updated_at']);
    }

    async getUsers() {
        const users = await this.userRepository.findAll({
            // select: {
            //     user_id: true,
            //     user_email: true,
            //     user_roles: true,
            // }
        });
        return users.map(user => unGetSelectDataFromObject(user, ['user_password', 'user_salt', 'created_at', 'updated_at']));
    }
}
