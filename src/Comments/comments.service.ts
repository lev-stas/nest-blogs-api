import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from './comments.schema';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../Posts/posts.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {}

  async getCommentById(id: string) {
    const comment = await this.commentModel.findOne(
      { id: id },
      { __v: 0, _id: 0 },
    );
    if (!comment) {
      return null;
    }
    return comment;
  }

  async getCommentsofPost(postId: string) {
    const targetPost = await this.postModel.findOne({ id: postId });
    if (!targetPost) {
      return null;
    }
    return this.commentModel.find({ postId: postId }).lean();
  }

  async deleteAllComments() {
    return this.commentModel.deleteMany({});
  }
}
