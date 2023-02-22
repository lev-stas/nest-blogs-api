import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Like {
  @Prop({
    required: true,
  })
  userId: string;
  @Prop({
    required: true,
  })
  login: string;
  @Prop({
    required: true,
  })
  addedAt: true;
}

export type LikesDocument = HydratedDocument<Like>;
export const LikesSchema = SchemaFactory.createForClass(Like);

@Schema()
export class CommentLike {
  @Prop({
    required: true,
  })
  commentId: string;
  @Prop({
    default: [],
    type: [LikesSchema],
  })
  commentLikes: Like[];
  @Prop({
    default: [],
    type: [LikesSchema],
  })
  commentDislikes: Like[];
}

export type CommentLikesDocument = HydratedDocument<CommentLike>;
export const CommentLikesSchema = SchemaFactory.createForClass(CommentLike);

@Schema()
export class PostLike {
  @Prop({
    required: true,
  })
  postId: string;
  @Prop({
    default: [],
    type: [LikesSchema],
  })
  postLikes: Like[];
  @Prop({
    default: [],
    type: [LikesSchema],
  })
  postDislikes: Like[];
  @Prop({
    default: [],
    type: [CommentLikesSchema],
  })
  commentsLikes: CommentLike[];
}

export type PostLikesDocument = HydratedDocument<PostLike>;
export const PostLikeSchema = SchemaFactory.createForClass(PostLike);
