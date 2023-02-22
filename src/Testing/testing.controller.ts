import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { BlogsRepository } from '../Blogs/blogs.repository';
import { LikesService } from '../Likes/likes.service';
import { PostsService } from '../Posts/posts.service';
import { UsersService } from '../Users/users.service';
import { CommentsService } from '../Comments/comments.service';

@Controller('testing')
export class TestingController {
  constructor(
    protected blogsRepository: BlogsRepository,
    protected postService: PostsService,
    protected likesService: LikesService,
    protected usersService: UsersService,
    protected commentsService: CommentsService,
  ) {}
  @Delete('all-data')
  @HttpCode(204)
  async deleteAllData() {
    await this.blogsRepository.deleteAll();
    await this.postService.deleteAllPosts();
    await this.likesService.deleteAllPostLikes();
    await this.usersService.deleteAllUsers();
    await this.commentsService.deleteAllComments();
  }
}
