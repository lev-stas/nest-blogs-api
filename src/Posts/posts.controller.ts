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
import { CommentsService } from '../Comments/comments.service';

@Controller('posts')
export class PostsController {
  constructor(
    protected postService: PostsService,
    protected commentsService: CommentsService,
  ) {}
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

  @Get(':id/comments')
  async getPostsComments(@Param('id') id: string) {
    const comments = await this.commentsService.getCommentsofPost(id);
    if (!comments) {
      throw new NotFoundException();
    }
    return comments;
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
