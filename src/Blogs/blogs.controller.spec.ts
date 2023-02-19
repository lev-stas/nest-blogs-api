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
        expect(response.body.isMembership).toEqual(true);

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
        expect(response.body.isMembership).toEqual(true);

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
      expect(response.body.isMembership).toEqual(true);
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
      expect(response.body.isMembership).toEqual(true);
    });
    it('should delete blog by id', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/blogs/${myBlogId}`)
        .expect(HttpStatus.NO_CONTENT);
    });
    it('should return 404 error', async () => {
      const response = await request(app.getHttpServer())
        .get(`/blogs/${myBlogId}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
