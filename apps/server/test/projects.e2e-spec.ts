import { type INestApplication } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { type App } from 'supertest/types';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { AppModule } from '@/modules/app/app.module';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { hash } from '@/utils/hash';

const PASSWORD = 'password123';

const createSignedInUser = async ({
  prisma,
  server,
  email,
}: {
  prisma: PrismaService;
  server: App;
  email: string;
}): Promise<string> => {
  await prisma.user.create({
    data: {
      email,
      password: await hash(PASSWORD),
      firstName: 'Ada',
      lastName: 'Lovelace',
    },
  });

  const loginResponse = await request(server)
    .post('/api/auth/login')
    .send({ username: email, password: PASSWORD })
    .expect(201);

  return loginResponse.body.access_token as string;
};

describe('Projects', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('A new workspace has no projects', async () => {
    const email = `ticket2-empty-${crypto.randomUUID()}@example.com`;

    try {
      const token = await createSignedInUser({
        prisma,
        server: app.getHttpServer(),
        email,
      });

      const response = await request(app.getHttpServer())
        .get('/api/projects')
        .query({ pageIndex: 0, pageSize: 10 })
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toEqual({
        data: [],
        total: 0,
        pageIndex: 0,
        pageSize: 10,
        totalPages: 0,
      });
    } finally {
      await prisma.user.delete({ where: { email } });
    }
  });

  it('Creating a project with a name shows it in the sidebar', async () => {
    const email = `ticket2-create-${crypto.randomUUID()}@example.com`;

    try {
      const token = await createSignedInUser({
        prisma,
        server: app.getHttpServer(),
        email,
      });

      await request(app.getHttpServer())
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Symeta' })
        .expect(201);

      const response = await request(app.getHttpServer())
        .get('/api/projects')
        .query({ pageIndex: 0, pageSize: 10 })
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.total).toBe(1);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe('Symeta');
      expect(response.body.data[0].position).toBe(0);
      expect(response.body.data[0].id).toEqual(expect.any(String));
      expect(response.body.data[0].id).not.toBe('');
    } finally {
      await prisma.user.delete({ where: { email } });
    }
  });

  it('A new project is placed after the ones already there', async () => {
    const email = `ticket2-order-${crypto.randomUUID()}@example.com`;

    try {
      const token = await createSignedInUser({
        prisma,
        server: app.getHttpServer(),
        email,
      });

      await request(app.getHttpServer())
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Alpha' })
        .expect(201);

      await request(app.getHttpServer())
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Beta' })
        .expect(201);

      const response = await request(app.getHttpServer())
        .get('/api/projects')
        .query({ pageIndex: 0, pageSize: 10 })
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(
        response.body.data.map((project: { name: string }) => project.name)
      ).toEqual(['Alpha', 'Beta']);
      expect(
        response.body.data.map(
          (project: { position: number }) => project.position
        )
      ).toEqual([0, 1]);
    } finally {
      await prisma.user.delete({ where: { email } });
    }
  });

  it('A blank name is rejected', async () => {
    const email = `ticket2-blank-${crypto.randomUUID()}@example.com`;
    const emptyWorkspace = {
      data: [],
      total: 0,
      pageIndex: 0,
      pageSize: 10,
      totalPages: 0,
    };

    try {
      const token = await createSignedInUser({
        prisma,
        server: app.getHttpServer(),
        email,
      });

      await request(app.getHttpServer())
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: '' })
        .expect(400);

      const afterEmpty = await request(app.getHttpServer())
        .get('/api/projects')
        .query({ pageIndex: 0, pageSize: 10 })
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(afterEmpty.body).toEqual(emptyWorkspace);

      await request(app.getHttpServer())
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: '   ' })
        .expect(400);

      const afterSpaces = await request(app.getHttpServer())
        .get('/api/projects')
        .query({ pageIndex: 0, pageSize: 10 })
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(afterSpaces.body).toEqual(emptyWorkspace);
    } finally {
      await prisma.user.delete({ where: { email } });
    }
  });

  it('A name that matches an existing project after trimming and ignoring letter case is rejected', async () => {
    const email = `ticket2-duplicate-${crypto.randomUUID()}@example.com`;

    try {
      const token = await createSignedInUser({
        prisma,
        server: app.getHttpServer(),
        email,
      });

      await request(app.getHttpServer())
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Symeta' })
        .expect(201);

      await request(app.getHttpServer())
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: ' symeta ' })
        .expect(409);

      const response = await request(app.getHttpServer())
        .get('/api/projects')
        .query({ pageIndex: 0, pageSize: 10 })
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.total).toBe(1);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe('Symeta');
    } finally {
      await prisma.user.delete({ where: { email } });
    }
  });

  it('Another user does not see or change the project', async () => {
    const emailA = `ticket2-owner-${crypto.randomUUID()}@example.com`;
    const emailB = `ticket2-other-${crypto.randomUUID()}@example.com`;

    try {
      const tokenA = await createSignedInUser({
        prisma,
        server: app.getHttpServer(),
        email: emailA,
      });
      const tokenB = await createSignedInUser({
        prisma,
        server: app.getHttpServer(),
        email: emailB,
      });

      await request(app.getHttpServer())
        .post('/api/projects')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ name: 'Symeta' })
        .expect(201);

      const unseen = await request(app.getHttpServer())
        .get('/api/projects')
        .query({ pageIndex: 0, pageSize: 10 })
        .set('Authorization', `Bearer ${tokenB}`)
        .expect(200);

      expect(unseen.body.data).toEqual([]);
      expect(unseen.body.total).toBe(0);

      await request(app.getHttpServer())
        .post('/api/projects')
        .set('Authorization', `Bearer ${tokenB}`)
        .send({ name: 'Other' })
        .expect(201);

      const unchanged = await request(app.getHttpServer())
        .get('/api/projects')
        .query({ pageIndex: 0, pageSize: 10 })
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200);

      expect(unchanged.body.data).toHaveLength(1);
      expect(unchanged.body.data[0].name).toBe('Symeta');
      expect(unchanged.body.data[0].position).toBe(0);
    } finally {
      await prisma.user.deleteMany({
        where: { email: { in: [emailA, emailB] } },
      });
    }
  });

  it('Signing out leaves the workspace', async () => {
    await request(app.getHttpServer())
      .get('/api/projects')
      .query({ pageIndex: 0, pageSize: 10 })
      .expect(401);
  });
});
