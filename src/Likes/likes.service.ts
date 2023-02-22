import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PostLike, PostLikesDocument } from './likes.schema';
import { Model } from 'mongoose';

@Injectable()
export class LikesService {
  constructor(
    @InjectModel(PostLike.name)
    private postLikesModel: Model<PostLikesDocument>,
  ) {}

  async deleteAllPostLikes(): Promise<boolean> {
    const deletionResult = await this.postLikesModel.deleteMany({});
    return deletionResult.deletedCount > 0;
  }
  async deletePostLikes(postId: string): Promise<boolean> {
    const deletionResult = await this.postLikesModel.deleteOne({
      postId: postId,
    });
    return deletionResult.deletedCount > 0;
  }
}
