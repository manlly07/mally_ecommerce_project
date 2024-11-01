import { Injectable } from '@nestjs/common';
import { unGetSelectDataFromObject, updateNestedArrayParser } from 'src/common/utils';
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

    async findById(params: {
        user_id: string,
        where?: object,
        include?: object
    }) {
        const { user_id, where, include } = params;
        const user = await this.userRepository.findById({
            id: user_id,
            where: where,
            include: include
        },
    );
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

    async updateMany(user_id: string, data: any) {
        const user = await this.userRepository.updateMany({
            where: {
                user_id
            },
            data: data
        });
        return unGetSelectDataFromObject(user, ['user_password', 'user_salt', 'created_at', 'updated_at']);
    }

    async getUsers(params?: object) {
        const users = await this.userRepository.findAll(params);
        return users.map(user => unGetSelectDataFromObject(user, ['user_password', 'user_salt', 'created_at', 'updated_at']));
    }

    async userHasPermission(user_id: string, permission: Array<string>) {
        // if(permission ) return true
        const userWithRole = await this.userRepository.findById({
            id: user_id,
            include: {
                user_roles: {
                    include: {
                        role: {
                            include: {
                                role_permissions: {
                                    include: {
                                        permission: true
                                    }
                                }
                            }
                        }
                    }
                },
            }
        }) as any;

        // return userWithRole;
        if(!userWithRole?.user_roles) return false;

        const roles = updateNestedArrayParser(userWithRole)

        return roles.some((role : any) => permission.includes(role.permission_name));
    }
}
