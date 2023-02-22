import { Test, TestingModule } from '@nestjs/testing';
import { HttpCode, HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';

describe('BlogsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });
  describe('Delete all data ', () => {
    it('should delete all data from all collections', async () => {
      const response = await request(app.getHttpServer()).delete(
        '/testing/all-data',
      );
      expect(response).toMatchObject({
        status: 204,
        body: {},
      });
    });
  });
  describe('Check creating, getting, changing and deleting post by id', () => {
    let postId = '';
    let blogId = '';
    let blogName = '';
    const postTitle = 'Test post title';
    const postDescription = 'Description of a test post';
    const postContent = 'Content of a test post';
    const newBlogDto = {
      name: 'Test post',
      description: 'Test post blog',
      websiteUrl: 'www.someurl.com',
    };
    it('should create new post', async () => {
      const blog = await request(app.getHttpServer())
        .post('/blogs')
        .send(newBlogDto)
        .expect(HttpStatus.CREATED);
      blogId = blog.body.id;
      blogName = blog.body.name;
      const postDto = {
        title: postTitle,
        shortDescription: postDescription,
        content: postContent,
        blogId: blog.body.id,
      };
      const newPost = await request(app.getHttpServer())
        .post('/posts')
        .send(postDto)
        .expect(HttpStatus.CREATED);
      expect(newPost.body.id).toBeDefined();
      expect(newPost.body.title).toEqual(postDto.title);
      expect(newPost.body.shortDescription).toEqual(postDto.shortDescription);
      expect(newPost.body.content).toEqual(postDto.content);
      expect(newPost.body.blogId).toEqual(blogId);
      expect(newPost.body.blogName).toEqual(blogName);
      expect(newPost.body.createdAt).toBeDefined();
      expect(newPost.body.extendedLikesInfo).toMatchObject({
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      });
      postId = newPost.body.id;
    });
    it('should get post by id', async () => {
      const targetPost = await request(app.getHttpServer())
        .get(`/posts/${postId}`)
        .expect(HttpStatus.OK);
      expect(targetPost.body.id).toEqual(postId);
      expect(targetPost.body.title).toEqual(postTitle);
      expect(targetPost.body.shortDescription).toEqual(postDescription);
      expect(targetPost.body.content).toEqual(postContent);
      expect(targetPost.body.blogId).toEqual(blogId);
      expect(targetPost.body.blogName).toEqual(blogName);
      expect(targetPost.body.createdAt).toBeDefined();
      expect(targetPost.body.extendedLikesInfo).toMatchObject({
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      });
    });
    it('should return 404 error if no post exists', async () => {
      await request(app.getHttpServer())
        .get('/posts/wrongUrl')
        .expect(HttpStatus.NOT_FOUND);
    });
    it('should change post content', async () => {
      const newContent = {
        title: 'modifiedTitle',
        shortDescription: 'modifiedDescription',
        content: 'modofiedContent',
      };
      await request(app.getHttpServer())
        .put(`/posts/${postId}`)
        .send(newContent)
        .expect(HttpStatus.NO_CONTENT);
    });
    it('should deleted post with current id', async () => {
      await request(app.getHttpServer())
        .delete(`/posts/${postId}`)
        .expect(HttpStatus.NO_CONTENT);
    });
    it('should return 404 error for getting deleted post', async () => {
      await request(app.getHttpServer())
        .get(`/posts/${postId}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
  describe('Check getting Blogs with pagination', () => {
    const posts = [];
    let blogId = '';
    it('should create a blog for testing', async () => {
      const response = await request(app.getHttpServer())
        .post('/blogs')
        .send({
          name: 'testName',
          description: 'testDescription',
          websiteUrl: 'www.testblog.com',
        })
        .expect(HttpStatus.CREATED);
      blogId = response.body.id;
    });
    it('should post 5 posts to current blog', async () => {
      for (let i = 0; i < 5; i++) {
        const response = await request(app.getHttpServer())
          .post('/posts')
          .send({
            title: `Post number ${i}`,
            shortDescription: 'test description',
            content: 'Some test content',
            blogId: blogId,
          })
          .expect(HttpStatus.CREATED);
        posts.push(response.body.id);
      }
    });
    it('should return 2 posts', async () => {
      const response = await request(app.getHttpServer())
        .get('/posts?pageNumber=2&pageSize=2&sortDirection=asc')
        .expect(HttpStatus.OK);
      expect(response.body.pagesCount).toEqual(3);
      expect(response.body.page).toEqual(2);
      expect(response.body.pageSize).toEqual(2);
      expect(response.body.totalCount).toEqual(posts.length);
      expect(response.body.items[0].title).toEqual('Post number 2');
      expect(response.body.items[1].title).toEqual('Post number 3');
    });
  });
});
