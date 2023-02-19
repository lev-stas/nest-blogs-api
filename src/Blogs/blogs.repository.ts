import { Model } from 'mongoose';
import { Injectable, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from './blogs.schema';
import {
  BlogsResponseDtoType,
  CreateBlogDtoType,
  FullBlogsResponseDtoType,
} from '../types/types';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

  async createBlog(
    createBlogDto: CreateBlogDtoType,
  ): Promise<BlogsResponseDtoType> {
    const blogForCreation = {
      id: uuidv4(),
      name: createBlogDto.name,
      description: createBlogDto.description,
      websiteUrl: createBlogDto.websiteUrl,
      createdAt: new Date().toISOString(),
    };
    const createdBlog = new this.blogModel(blogForCreation);
    await createdBlog.save();
    return this.blogModel
      .findOne({ id: createdBlog.id }, { _id: 0, __v: 0 })
      .lean();
  }

  async findAll(
    searchNameTerm = '/*',
    sortBy = 'createdAt',
    sortDirection = 'desc',
    pageNumber = 1,
    pageSize = 10,
  ): Promise<FullBlogsResponseDtoType> {
    const totalBlogs = await this.blogModel.countDocuments({
      name: { $regex: searchNameTerm, $options: 'i' },
    });
    const skipNumber = pageNumber < 2 ? 0 : (pageNumber - 1) * pageSize;
    const directionSort = sortDirection === 'desc' ? -1 : 1;
    const blogsList = await this.blogModel
      .find(
        { name: { $regex: searchNameTerm, $options: 'i' } },
        { _id: 0, __v: 0 },
      )
      .sort({ [sortBy]: directionSort })
      .skip(skipNumber)
      .limit(pageSize)
      .lean();
    return {
      pagesCount: Math.ceil(totalBlogs / pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: totalBlogs,
      items: blogsList,
    };
  }

  async findBlogById(blogId: string): Promise<BlogsResponseDtoType> {
    return await this.blogModel
      .findOne({ id: blogId }, { _id: 0, __v: 0 })
      .lean();
  }

  async deleteBlogById(id: string) {
    return this.blogModel.deleteOne({ id: id });
  }

  async deleteAll() {
    return this.blogModel.deleteMany({});
  }
}
