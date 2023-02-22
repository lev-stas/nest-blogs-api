import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
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
  describe('Check getting Blogs with filtering and pagination', () => {
    const blogIds: string[] = [];
    it('should create 5 blogs with correct response', async () => {
      for (let i = 1; i <= 5; i++) {
        const blogName = `blogname ${i}`;
        const response = await request(app.getHttpServer())
          .post('/blogs')
          .send({
            name: blogName,
            description: 'blogs description',
            websiteUrl: 'www.myblog.com',
          })
          .expect(HttpStatus.CREATED);

        expect(response.body.id).toBeDefined();
        expect(response.body.name).toEqual(blogName);
        expect(response.body.description).toEqual('blogs description');
        expect(response.body.websiteUrl).toEqual('www.myblog.com');
        expect(response.body.createdAt).toBeDefined();
        expect(response.body.isMembership).toEqual(false);

        blogIds.push(response.body.name);
      }
    });
    it('should create 3 blogs with correct response', async () => {
      for (let i = 1; i <= 3; i++) {
        const blogName = `name ${i}`;
        const response = await request(app.getHttpServer())
          .post('/blogs')
          .send({
            name: blogName,
            description: 'blogs description',
            websiteUrl: 'www.myblog.com',
          })
          .expect(HttpStatus.CREATED);

        expect(response.body.id).toBeDefined();
        expect(response.body.name).toEqual(blogName);
        expect(response.body.description).toEqual('blogs description');
        expect(response.body.websiteUrl).toEqual('www.myblog.com');
        expect(response.body.createdAt).toBeDefined();
        expect(response.body.isMembership).toEqual(false);

        blogIds.push(response.body.name);
      }
    });
    it('should return 2 blogs with name blogname in page 2 ', async () => {
      const searchTerm = 'og';
      const response = await request(app.getHttpServer())
        .get(`/blogs?searchNameTerm=${searchTerm}&pageNumber=2&pageSize=2`)
        .expect(HttpStatus.OK);
      const totalCount = blogIds.filter((blog) =>
        blog.includes(searchTerm),
      ).length;
      expect(response.body.totalCount).toEqual(totalCount);
      expect(response.body.pageSize).toEqual(2);
      expect(response.body.page).toEqual(2);
      expect(response.body.pagesCount).toEqual(
        Math.ceil(totalCount / response.body.pageSize),
      );
    });
  });
  describe('Check Getting Blog By Id', () => {
    const newBlog = {
      name: 'Some name',
      description: 'description text',
      websiteUrl: 'www.myblog.com',
    };
    let myBlogId = '';
    const newName = 'New name';
    it('should create and return new blog', async () => {
      const response = await request(app.getHttpServer())
        .post('/blogs')
        .send(newBlog)
        .expect(HttpStatus.CREATED);
      expect(response.body.id).toBeDefined();
      expect(response.body.name).toEqual(newBlog.name);
      expect(response.body.description).toEqual(newBlog.description);
      expect(response.body.websiteUrl).toEqual(newBlog.websiteUrl);
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.isMembership).toEqual(false);
      myBlogId = response.body.id;
    });
    it('should return blog by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/blogs/${myBlogId}`)
        .expect(HttpStatus.OK);
      expect(response.body.id).toEqual(myBlogId);
      expect(response.body.name).toEqual(newBlog.name);
      expect(response.body.description).toEqual(newBlog.description);
      expect(response.body.websiteUrl).toEqual(newBlog.websiteUrl);
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.isMembership).toEqual(false);
    });
    it('should return 404 if get wrong blog', async () => {
      await request(app.getHttpServer())
        .get('/blogs/someWrongBlogId')
        .expect(HttpStatus.NOT_FOUND);
    });
    it('should update blogs name', async () => {
      await request(app.getHttpServer())
        .put(`/blogs/${myBlogId}`)
        .send({
          name: newName,
        })
        .expect(HttpStatus.NO_CONTENT);
    });
    it('should return blog with new name', async () => {
      const response = await request(app.getHttpServer())
        .get(`/blogs/${myBlogId}`)
        .expect(HttpStatus.OK);
      expect(response.body.name).toEqual(newName);
    });
    it('should return 404 status if try to update wrong blog', async () => {
      await request(app.getHttpServer())
        .put(`/blogs/someWrongBlogId`)
        .expect(HttpStatus.NOT_FOUND);
    });
    it('should delete blog by id', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/blogs/${myBlogId}`)
        .expect(HttpStatus.NO_CONTENT);
    });
    it('should return 404 error when get deleted blog', async () => {
      const response = await request(app.getHttpServer())
        .get(`/blogs/${myBlogId}`)
        .expect(HttpStatus.NOT_FOUND);
    });
    it('should return 404 error if try to delete wrong blog', async () => {
      await request(app.getHttpServer())
        .delete('/blogs/someWrongBlogId')
        .expect(HttpStatus.NOT_FOUND);
    });
  });
  describe('POST a post to current blog', () => {
    let blogId = '';
    const dto = {
      title: 'post from blog',
      shortDescription: 'test post short description',
      content: 'test post blog content',
    };
    it('should create a new blog for test posts', async () => {
      const response = await request(app.getHttpServer())
        .post('/blogs')
        .send({
          name: 'test post blog',
          description: 'test blog description',
          websiteUrl: 'www.mynewblog.com',
        })
        .expect(HttpStatus.CREATED);
      blogId = response.body.id;
    });
    it('should create a post for current blog', async () => {
      const response = await request(app.getHttpServer())
        .post(`/blogs/${blogId}/posts`)
        .send(dto)
        .expect(HttpStatus.CREATED);
      expect(response.body.id).toBeDefined();
      expect(response.body.title).toEqual(dto.title);
      expect(response.body.shortDescription).toEqual(dto.shortDescription);
      expect(response.body.content).toEqual(dto.content);
    });
  });
  describe('GET /blogs/:id/posts', () => {
    let blogId = '';
    it('should create blog for getting its post', async () => {
      const response = await request(app.getHttpServer())
        .post('/blogs')
        .send({
          name: 'test blog',
          description: 'test blog description',
          websiteUrl: 'www.someblog.com',
        })
        .expect(HttpStatus.CREATED);
      blogId = response.body.id;
    });
    it('should create 5 posts for current blog', async () => {
      for (let i = 1; i < 6; i++) {
        await request(app.getHttpServer())
          .post(`/blogs/${blogId}/posts`)
          .send({
            title: `post number ${i}`,
            shortDescription: 'description of a post',
            content: 'content of a post',
          })
          .expect(HttpStatus.CREATED);
      }
    });
    it('should return posts of current blog', async () => {
      const response = await request(app.getHttpServer())
        .get(`/blogs/${blogId}/posts`)
        .expect(HttpStatus.OK);
      expect(response.body.pagesCount).toEqual(1);
      expect(response.body.page).toEqual(1);
      expect(response.body.pageSize).toEqual(10);
      expect(response.body.totalCount).toEqual(5);
      expect(response.body.items.length).toEqual(5);
    });
    it('should return 404 error if post is not existing', async () => {
      await request(app.getHttpServer())
        .get('/blogs/non-existing-blog-id/posts')
        .expect(HttpStatus.NOT_FOUND);
    });
  });
  describe('GET all posts of a current blog', () => {
    let newBlogId = '';
    const dto = {
      name: 'next test blog',
      description: 'description of a test blog',
      websiteUrl: 'www.myblog.com',
    };
    const posts = [];
    it('should create a new blog for test posts', async () => {
      const response = await request(app.getHttpServer())
        .post('/blogs')
        .send(dto)
        .expect(HttpStatus.CREATED);
      newBlogId = response.body.id;
    });
    it('should create 5 posts of a current blog', async () => {
      for (let i = 0; i < 5; i++) {
        const response = await request(app.getHttpServer())
          .post(`/blogs/${newBlogId}/posts`)
          .send({
            title: `post from blog number ${i}`,
            shortDescription: 'test post short description',
            content: 'test post blog content',
          })
          .expect(HttpStatus.CREATED);
        posts.push(response.body.id);
      }
    });
    it('should return 5 posts', async () => {
      const response = await request(app.getHttpServer())
        .get(
          `/blogs/${newBlogId}/posts?pageNumber=2&pageSize=2&sortDirection=asc`,
        )
        .expect(HttpStatus.OK);
      expect(response.body.pagesCount).toEqual(3);
      expect(response.body.page).toEqual(2);
      expect(response.body.pageSize).toEqual(2);
      expect(response.body.totalCount).toEqual(posts.length);
      expect(response.body.items[0].title).toEqual('post from blog number 2');
      expect(response.body.items[1].title).toEqual('post from blog number 3');
    });
  });
});
