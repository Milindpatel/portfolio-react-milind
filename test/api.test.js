import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import mongoose from 'mongoose';
import request from 'supertest';
import { SignJWT } from 'jose';
import { createApp } from '../server/app';
import { createAuth } from '../server/services/auth';

const NAMESPACE = 'https://example.test';
const SECRET = new TextEncoder().encode('test-secret-test-secret-test-secret!!');
const auth = { auth0Domain: 'tenant.example', auth0ClientId: 'client-123', namespace: NAMESPACE };

async function token(role, sub = 'auth0|owner') {
  return new SignJWT({ name: 'Milind', [`${NAMESPACE}/role`]: role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(sub)
    .setIssuer(`https://${auth.auth0Domain}/`)
    .setAudience(auth.auth0ClientId)
    .setExpirationTime('1h')
    .sign(SECRET);
}

// Start an in-memory MongoDB. CI must have it; locally, skip if the binary can't be downloaded.
let mongo;
try {
  const { MongoMemoryServer } = await import('mongodb-memory-server');
  mongo = await MongoMemoryServer.create();
} catch (err) {
  if (process.env.CI) throw err;
  console.warn(`Skipping API tests: ${err.message}`);
}

describe.skipIf(!mongo)('API', () => {
  let app;
  let owner;
  let visitor;

  beforeAll(async () => {
    await mongoose.connect(mongo.getUri());
    app = createApp({ auth: createAuth({ ...auth, secret: Buffer.from(SECRET), algorithms: ['HS256'] }) });
    owner = `Bearer ${await token('siteOwner')}`;
    visitor = `Bearer ${await token(undefined, 'auth0|visitor')}`;
  });

  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongo?.stop();
  });

  const portfolio = {
    title: 'Developer', company: 'Acme', location: 'Toronto', position: 'Dev', description: 'Built things', startDate: '2020-01-01',
  };

  describe('portfolios', () => {
    it('lists publicly but only the owner can create', async () => {
      expect((await request(app).post('/api/v1/portfolios').send(portfolio)).status).toBe(401);
      expect((await request(app).post('/api/v1/portfolios').set('Authorization', visitor).send(portfolio)).status).toBe(403);

      const created = await request(app).post('/api/v1/portfolios').set('Authorization', owner).send({ ...portfolio, userId: 'evil' });
      expect(created.status).toBe(201);
      expect(created.body.userId).toBe('auth0|owner');

      const list = await request(app).get('/api/v1/portfolios');
      expect(list.body).toHaveLength(1);
    });

    it('validates input', async () => {
      const res = await request(app).post('/api/v1/portfolios').set('Authorization', owner).send({ ...portfolio, endDate: '2019-01-01' });
      expect(res.status).toBe(422);
    });

    it('updates, clears the end date, and deletes', async () => {
      const { body } = await request(app).post('/api/v1/portfolios').set('Authorization', owner).send({ ...portfolio, endDate: '2021-01-01' });

      const updated = await request(app).patch(`/api/v1/portfolios/${body._id}`).set('Authorization', owner).send({ title: 'Lead', endDate: null });
      expect(updated.status).toBe(200);
      expect(updated.body.title).toBe('Lead');
      expect(updated.body.endDate).toBeUndefined();

      expect((await request(app).delete(`/api/v1/portfolios/${body._id}`).set('Authorization', owner)).status).toBe(200);
      expect((await request(app).get(`/api/v1/portfolios/${body._id}`)).status).toBe(404);
    });

    it('returns 404 for malformed ids', async () => {
      expect((await request(app).get('/api/v1/portfolios/not-an-id')).status).toBe(404);
    });
  });

  describe('blogs', () => {
    const story = '<h1>Hello World</h1><p>Hi<script>alert(1)</script></p>';

    async function createDraft() {
      const res = await request(app)
        .post(`/api/v1/blogs?lockId=${Math.random()}`)
        .set('Authorization', owner)
        .send({ title: 'Hello World', subTitle: 'Sub', story, status: 'published' });
      expect(res.status).toBe(201);
      return res.body;
    }

    it('creates drafts with sanitized HTML', async () => {
      const blog = await createDraft();
      expect(blog.status).toBe('draft');
      expect(blog.story).toBe('<h1>Hello World</h1><p>Hi</p>');
      expect(blog.author).toBe('Milind');
    });

    it('hides drafts from the public', async () => {
      const blog = await createDraft();
      expect((await request(app).get('/api/v1/blogs')).body).toHaveLength(0);
      expect((await request(app).get(`/api/v1/blogs/${blog._id}`)).status).toBe(401);
      expect((await request(app).get(`/api/v1/blogs/${blog._id}`).set('Authorization', owner)).status).toBe(200);
    });

    it('publishes with a unique slug', async () => {
      const first = await createDraft();
      const second = await createDraft();
      const p1 = await request(app).patch(`/api/v1/blogs/${first._id}`).set('Authorization', owner).send({ status: 'published' });
      const p2 = await request(app).patch(`/api/v1/blogs/${second._id}`).set('Authorization', owner).send({ status: 'published' });
      expect(p1.body.slug).toBe('hello-world');
      expect(p2.body.slug).toBe('hello-world-2');

      const bySlug = await request(app).get('/api/v1/blogs/s/hello-world');
      expect(bySlug.status).toBe(200);
      expect((await request(app).get('/api/v1/blogs')).body).toHaveLength(2);
    });

    it('rejects duplicate submits with the same lock id', async () => {
      const send = () => request(app).post('/api/v1/blogs?lockId=42').set('Authorization', owner).send({ title: 'T', subTitle: 'S', story: '<p>x</p>' });
      expect((await send()).status).toBe(201);
      expect((await send()).status).toBe(409);
    });

    it('rejects invalid status values', async () => {
      const blog = await createDraft();
      const res = await request(app).patch(`/api/v1/blogs/${blog._id}`).set('Authorization', owner).send({ status: 'hacked' });
      expect(res.status).toBe(422);
    });
  });

  it('removed the unauthenticated books API', async () => {
    expect((await request(app).get('/api/v1/books')).status).toBe(404);
  });
});
