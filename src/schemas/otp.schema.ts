import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OtpDocument = Otp & Document;

@Schema({ timestamps: true, collection: 'Otp_logs' })
export class Otp {
  @Prop({ required: true })
  otp_token: string;

  @Prop({ required: true })
  otp_email: string;

  @Prop({
    required: true,
    enum: ['active', 'pending'],
    default: 'pending',
  })
  otp_status: string;

  @Prop({
    type: Date,
    default: Date.now,
    index: { expires: '5m' },
  })
  expireAt: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
