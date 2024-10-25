import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';

export type UserDocument = Keys & Document;

@Schema({ timestamps: true, collection: 'Key_logs' })
export class Keys {

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'User' })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  privateKey: string;

  
  @Prop({ required: true })
  publicKey: string;

  @Prop({ required: true })
  refreshTokensUsed: Array<string>;

  @Prop({ required: true })
  refreshToken: string;

}

export const KeySchema = SchemaFactory.createForClass(Keys);
