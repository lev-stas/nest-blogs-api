import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { BlogsRepository } from './blogs.repository';
import { CreateBlogDtoType } from '../types/types';

@Controller('blogs')
export class BlogsController {
  constructor(protected blogsRepository: BlogsRepository) {}
  @Get()
  async getAllBlogs(
    @Query('searchNameTerm') searchNameTerm: string,
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: string,
    @Query('pageNumber') pageNumber: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.blogsRepository.findAll(
      searchNameTerm,
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
    );
  }

  @Get(':id')
  async getBlogById(@Param('id') id: string) {
    const targetBlog = await this.blogsRepository.findBlogById(id);
    if (!targetBlog) {
      throw new NotFoundException();
    }
    return targetBlog;
  }

  @Post()
  async postNewBlog(@Body() dto: CreateBlogDtoType) {
    return this.blogsRepository.createBlog(dto);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteBlogById(@Param('id') id: string) {
    await this.blogsRepository.deleteBlogById(id);
    return {};
  }
}
