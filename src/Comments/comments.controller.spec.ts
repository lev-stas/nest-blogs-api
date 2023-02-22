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
  describe('GET comments/:id', () => {
    it('should return 404 error for not existing comment', async () => {
      await request(app.getHttpServer())
        .get('/comments/non-existing-comment')
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
