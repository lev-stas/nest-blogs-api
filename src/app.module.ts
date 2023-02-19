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

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      dbName: 'BlogsAPI',
    }),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
  ],
  controllers: [AppController, BlogsController, TestingController],
  providers: [AppService, BlogsRepository],
})
export class AppModule {}
