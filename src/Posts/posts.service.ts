import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './posts.schema';
import { Blog, BlogDocument } from '../Blogs/blogs.schema';
import { Model } from 'mongoose';
import { CreatePostDtoType, PostsResponseDtoType } from '../types/types';
import { v4 as uuidv4 } from 'uuid';
import { PostLike, PostLikesDocument } from '../Likes/likes.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @InjectModel(PostLike.name)
    private postLikesModel: Model<PostLikesDocument>,
  ) {}
  async createPost(dto: {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
  }): Promise<PostsResponseDtoType> {
    const blogToAddPost = await this.blogModel.findOne(
      { id: dto.blogId },
      { id: 1, name: 1 },
    );
    if (!blogToAddPost) {
      return null;
    }
    const postDto: CreatePostDtoType = {
      id: uuidv4(),
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
      blogName: blogToAddPost.name,
      createdAt: new Date().toISOString(),
    };
    const newPost = await new this.postModel(postDto).save();
    await new this.postLikesModel({ postId: newPost.id }).save();
    return {
      id: newPost.id,
      title: newPost.title,
      shortDescription: newPost.shortDescription,
      content: newPost.content,
      blogId: newPost.blogId,
      blogName: blogToAddPost.name,
      createdAt: newPost.createdAt,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    };
  }

  async getAll(
    pageNumber = 1,
    pageSize = 10,
    sortBy = 'createdAt',
    sortDirection = 'desc',
    blogId = null,
  ) {
    const findPostFilter = blogId ? { blogId: blogId } : {};
    const totalPosts = await this.postModel.countDocuments(findPostFilter);
    const skipNumber = pageNumber < 2 ? 0 : (pageNumber - 1) * pageSize;
    const directionSort = sortDirection === 'desc' ? -1 : 1;
    const postsList = await this.postModel
      .find(findPostFilter, { _id: 0, __v: 0 })
      .sort({ [sortBy]: directionSort })
      .skip(skipNumber)
      .limit(pageSize)
      .lean();
    const postsToResponse = [];
    for (let i = 0; i < postsList.length; i++) {
      postsToResponse.push({
        id: postsList[i].id,
        title: postsList[i].title,
        shortDescription: postsList[i].shortDescription,
        content: postsList[i].content,
        blogId: postsList[i].blogId,
        blogName: postsList[i].blogName,
        createdAt: postsList[i].createdAt,
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
          newestLikes: [],
        },
      });
    }
    return {
      pagesCount: Math.ceil(totalPosts / pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: totalPosts,
      items: postsToResponse,
    };
  }

  async getPostById(postId: string): Promise<PostsResponseDtoType> {
    const targetPost = await this.postModel.findOne(
      { id: postId },
      { _id: 0, __v: 0 },
    );
    if (!targetPost) {
      return null;
    }
    return {
      id: targetPost.id,
      title: targetPost.title,
      shortDescription: targetPost.shortDescription,
      content: targetPost.content,
      blogId: targetPost.blogId,
      blogName: targetPost.blogName,
      createdAt: targetPost.createdAt,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    };
  }

  async editPost(
    postId: string,
    dto: {
      title?: string;
      shortDescription?: string;
      content?: string;
      blogId?: string;
    },
  ) {
    const targetPost = await this.postModel.findOne({ id: postId });
    if (!targetPost) {
      return null;
    }
    if (dto.title) {
      targetPost.title = dto.title;
    }
    if (dto.shortDescription) {
      targetPost.shortDescription = dto.shortDescription;
    }
    if (dto.content) {
      targetPost.content = dto.content;
    }
    if (dto.blogId) {
      const targetBlog = await this.blogModel.findOne({ id: dto.blogId });
      if (!targetBlog) {
        return null;
      }
      targetPost.blogId = dto.blogId;
    }
    return targetPost.save();
  }

  async deletePostById(id: string) {
    const deletionResult = await this.postModel.deleteOne({ id: id });
    if (!(deletionResult.deletedCount > 0)) {
      return null;
    }
    await this.postLikesModel.deleteOne({ postId: id });
    return deletionResult.acknowledged;
  }

  async deleteAllPosts() {
    await this.postModel.deleteMany({});
    return true;
  }
}
