import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Keys } from 'src/schemas/key.schema';
import { KeyType } from './keys.dto';

@Injectable()
export class KeysService {
    constructor(
        @InjectModel(Keys.name) private KeyModel: Model<Keys>,
    ) {}

    async create(data : KeyType ) {
        const { userId: filter , ...update } = data;
        const options = { upsert: true, new: true };
        
        const token = await this.KeyModel.findOneAndUpdate(filter, update, options).exec();
        return token ? token.publicKey : null

    }
}
