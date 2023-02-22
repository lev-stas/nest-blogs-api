import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({
    required: true,
  })
  id: string;
  @Prop({
    required: true,
  })
  login: string;
  @Prop({
    required: true,
  })
  email: string;
  @Prop({
    required: true,
  })
  salt: string;
  @Prop({
    required: true,
  })
  passHash: string;
  @Prop({
    required: true,
  })
  createdAt: string;
  @Prop({
    required: true,
  })
  isConfirmed: boolean;
  @Prop({
    type: {
      confirmationCode: String,
      expirationDate: Date,
    },
    default: {},
  })
  emailConfirmation: {
    confirmationCode: string;
    expirationDate: Date;
  };
}
export const UserSchema = SchemaFactory.createForClass(User);
