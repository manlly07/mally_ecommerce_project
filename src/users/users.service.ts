import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
    ) {}
    async findByEmail(usr_email: string) {
        return this.userModel.findOne({ usr_email}).lean();
    }

    async create({ usr_email, usr_role, usr_password, usr_salt }) {
        const newUser = this.userModel.create({
            "usr_password": usr_password,
            "usr_salt": usr_salt,
            "usr_email": usr_email,
            "usr_role": usr_role,
          });
        return newUser;
    }
}
