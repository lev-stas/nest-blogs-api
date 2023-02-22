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
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(protected postService: PostsService) {}
  @Get()
  async getAllPosts(
    @Query('pageNumber') pageNumber: number,
    @Query('pageSize') pageSize: number,
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: string,
  ) {
    return this.postService.getAll(pageNumber, pageSize, sortBy, sortDirection);
  }

  @Get(':id')
  async getPostById(@Param('id') id: string) {
    const targetPost = await this.postService.getPostById(id);
    if (!targetPost) {
      throw new NotFoundException();
    }
    return targetPost;
  }
  @Post()
  async postNewPost(
    @Body()
    dto: {
      title: string;
      shortDescription: string;
      content: string;
      blogId: string;
    },
  ) {
    const newPost = await this.postService.createPost(dto);
    if (!newPost) {
      throw new NotFoundException();
    }
    return newPost;
  }

  @Put(':id')
  @HttpCode(204)
  async editPost(
    @Param('id') id: string,
    @Body()
    dto: {
      title?: string;
      shortDescription?: string;
      content?: string;
      blogId?: string;
    } = {},
  ) {
    const changedResult = await this.postService.editPost(id, dto);
    if (!changedResult) {
      throw new NotFoundException();
    }
    return {};
  }

  @Delete(':id')
  @HttpCode(204)
  async deletePostById(@Param('id') id: string) {
    const deletedPost = await this.postService.deletePostById(id);
    if (!deletedPost) {
      throw new NotFoundException();
    }
  }
}
