import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { randomInt } from 'crypto';
import { Model } from 'mongoose';
import { Otp } from 'src/schemas/otp.schema';

@Injectable()
export class OtpService {
    constructor(
        @InjectModel(Otp.name) private OTPModel: Model<Otp>,
    ) {}
    generateTokenRandom() {
        const token = randomInt(0, Math.pow(2, 32))
        return token;
    }

    async create( email: string ) {
        const findOtp = await this.OTPModel.findOne({ otp_email: email }).lean();

        if(findOtp) return findOtp;

        const token = this.generateTokenRandom();
        const newOtp = await this.OTPModel.create({
            otp_token: token,
            otp_email: email,
        });

        return newOtp;
    }

    async checkEmailToken( token: string ) {
        const findOtp = await this.OTPModel.findOne({ otp_token: token }).lean();
        if(!findOtp) throw new BadRequestException('Invalid token');

        this.OTPModel.findOneAndDelete({ otp_token: token }).then();

        return findOtp;
    }
}
