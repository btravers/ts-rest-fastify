import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import * as request from 'supertest';
import * as crypto from 'crypto';
import { AppModule } from './app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication(new FastifyAdapter());

    await app.init();
  });

  it('/posts (GET) list empty', async () => {
    /// GIVEN

    /// WHEN
    const response = await request(app.getHttpServer()).get('/posts').send();

    /// THEN
    expect(response).toMatchObject({
      status: 200,
      body: [],
    });
  });

  it('/posts/:id (GET) id unknown', async () => {
    /// GIVEN
    const id = crypto.randomUUID();

    /// WHEN
    const response = await request(app.getHttpServer())
      .get(`/posts/${id}`)
      .send();

    /// THEN
    expect(response).toMatchObject({
      status: 404,
      body: {},
    });
  });

  it('/posts/:id (GET) id invalid', async () => {
    /// GIVEN
    const id = 'id';

    /// WHEN
    const response = await request(app.getHttpServer())
      .get(`/posts/${id}`)
      .send();

    /// THEN
    expect(response).toMatchObject({
      status: 400,
      body: expect.any(Object),
    });
  });

  it('/posts (POST)', async () => {
    /// GIVEN
    const title = 'First post';
    const body = 'First body';

    /// WHEN
    const response = await request(app.getHttpServer()).post('/posts').send({
      title,
      body,
    });

    /// THEN
    expect(response).toMatchObject({
      status: 201,
      body: expect.objectContaining({
        title,
        body,
      }),
    });
  });

  it('/posts (POST) invalid body', async () => {
    /// GIVEN
    const title = 'First post';
    const body = null;

    /// WHEN
    const response = await request(app.getHttpServer()).post('/posts').send({
      title,
      body,
    });

    /// THEN
    expect(response).toMatchObject({
      status: 400,
      body: expect.any(Object),
    });
  });

  it('/posts (GET)', async () => {
    /// GIVEN

    /// WHEN
    const response = await request(app.getHttpServer()).get('/posts').send();

    /// THEN
    expect(response).toMatchObject({
      status: 200,
      body: [
        expect.objectContaining({
          title: 'First post',
          body: 'First body',
        }),
      ],
    });
  });
});
