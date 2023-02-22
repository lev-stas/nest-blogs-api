import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import * as request from 'supertest';

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
  let singleUserId = '';
  const singleUser = {
    login: 'singleuser',
    email: 'user@myblog.com',
    password: '123Password',
  };
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
  describe('POST /Users', () => {
    it('should return created user', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(singleUser)
        .expect(HttpStatus.CREATED);
      expect(response.body.id).toBeDefined();
      expect(response.body.login).toEqual(singleUser.login);
      expect(response.body.email).toEqual(singleUser.email);
      expect(response.body.createdAt).toBeDefined();
      singleUserId = response.body.id;
    });
  });
  describe('DELETE /users/:id', () => {
    it('should delete user with id', async () => {
      await request(app.getHttpServer())
        .delete(`/users/${singleUserId}`)
        .expect(HttpStatus.NO_CONTENT);
    });
    it('should return 404 error for non existing user', async () => {
      await request(app.getHttpServer())
        .delete(`/users/${singleUserId}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
  describe('GET /User', () => {
    it('should create 8 users', async () => {
      for (let i = 0; i < 5; i++) {
        const createdUser = await request(app.getHttpServer())
          .post('/users')
          .send({
            login: `user ${i}`,
            email: `user${i}@email.com`,
            password: '123Password',
          })
          .expect(HttpStatus.CREATED);
      }
      for (let i = 0; i < 3; i++) {
        await request(app.getHttpServer())
          .post('/users')
          .send({
            login: `name ${i}`,
            email: `name${i}@email.com`,
            password: '123Password',
          })
          .expect(HttpStatus.CREATED);
      }
    });
    it('should get 2 users', async () => {
      const response = await request(app.getHttpServer())
        .get(
          '/users?searchLoginTerm=user&pageNumber=2&pageSize=2&sortDirection=asc',
        )
        .expect(HttpStatus.OK);
      expect(response.body.pagesCount).toEqual(3);
      expect(response.body.page).toEqual(2);
      expect(response.body.pageSize).toEqual(2);
      expect(response.body.items[0].login).toEqual('user 2');
      expect(response.body.items[1].login).toEqual('user 3');
    });
  });
});
