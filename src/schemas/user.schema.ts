import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true, collection: 'Users' })
export class User {
  @Prop({ default: '' })
  usr_name: string;

  @Prop({ default: '' })
  usr_password: string;

  @Prop({ default: '' })
  usr_salt: string;

  @Prop({ required: true, unique: true })
  usr_email: string;

  @Prop({ default: '', unique: true })
  usr_phone: string;

  @Prop({ default: 'Male', enum: ['Male', 'Female'] })
  usr_gender: string;

  @Prop({ default: '' })
  usr_avatar: string;

  @Prop({ default: null })
  usr_date_of_birth: Date;

  //   @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Role' })
  //   usr_role: MongooseSchema.Types.ObjectId;

  @Prop({ default: 'user', enum: ['user', 'shop', 'admin'] })
  usr_role: string;

  @Prop({ default: 'active', enum: ['active', 'inactive', 'block'] })
  usr_status: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
