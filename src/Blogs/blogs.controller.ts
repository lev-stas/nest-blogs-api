import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BlogsRepository } from './blogs.repository';
import { CreateBlogDtoType } from '../types/types';
import { PostsService } from '../Posts/posts.service';

@Controller('blogs')
export class BlogsController {
  constructor(
    protected blogsRepository: BlogsRepository,
    protected postsService: PostsService,
  ) {}
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

  @Get(':id/posts')
  async getAllPostsOfBlog(
    @Param('id') id: string,
    @Query('pageNumber') pageNumber: number,
    @Query('pageSize') pageSize: number,
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: string,
  ) {
    return this.postsService.getAll(
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      id,
    );
  }

  @Post()
  async postNewBlog(@Body() dto: CreateBlogDtoType) {
    return this.blogsRepository.createBlog(dto);
  }

  @Post(':id/posts')
  async postNewPost(
    @Param('id') id: string,
    @Body()
    dto: { title: 'string'; shortDescription: 'string'; content: 'string' },
  ) {
    const newPost = await this.postsService.createPost({
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: id,
    });
    if (!newPost) {
      throw new NotFoundException();
    }
    return newPost;
  }

  @Put(':id')
  @HttpCode(204)
  async changePost(
    @Param('id') id: string,
    @Body()
    dto: { name?: string; description?: string; websiteUrl?: string } = {},
  ) {
    const updatedBlog = await this.blogsRepository.changeCurrentBlog(id, dto);
    if (!updatedBlog) {
      throw new NotFoundException();
    }
    return {};
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteBlogById(@Param('id') id: string) {
    const deleteBlog = await this.blogsRepository.deleteBlogById(id);
    if (!deleteBlog) {
      throw new NotFoundException();
    }
    return {};
  }
}
