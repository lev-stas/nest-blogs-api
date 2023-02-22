import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import * as process from 'process';
import { BlogsController } from './Blogs/blogs.controller';
import { BlogsRepository } from './Blogs/blogs.repository';
import { Blog, BlogSchema } from './Blogs/blogs.schema';
import { TestingController } from './Testing/testing.controller';
import { PostsController } from './Posts/posts.controller';
import { PostsService } from './Posts/posts.service';
import { Post, PostSchema } from './Posts/posts.schema';
import { PostLike, PostLikeSchema } from './Likes/likes.schema';
import { LikesService } from './Likes/likes.service';
import { UsersController } from './Users/users.controller';
import { UsersService } from './Users/users.service';
import { User, UserSchema } from './Users/users.schema';
import { Comment, CommentsSchema } from './Comments/comments.schema';
import { CommentsService } from './Comments/comments.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      dbName: 'BlogsAPI',
    }),
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: PostLike.name, schema: PostLikeSchema },
      { name: User.name, schema: UserSchema },
      { name: Comment.name, schema: CommentsSchema },
    ]),
  ],
  controllers: [
    AppController,
    BlogsController,
    TestingController,
    PostsController,
    UsersController,
  ],
  providers: [
    AppService,
    BlogsRepository,
    PostsService,
    LikesService,
    UsersService,
    CommentsService,
  ],
})
export class AppModule {}
