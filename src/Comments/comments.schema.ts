import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Comment {
  @Prop({
    required: true,
  })
  id: string;
  @Prop({
    required: true,
  })
  content: string;
  @Prop({
    required: true,
  })
  userId: string;
  @Prop({
    required: true,
  })
  userLogin: string;
  @Prop({
    required: true,
  })
  postId: string;
  @Prop({
    required: true,
  })
  createdAt: string;
}

export type CommentDocument = HydratedDocument<Comment>;
export const CommentsSchema = SchemaFactory.createForClass(Comment);
