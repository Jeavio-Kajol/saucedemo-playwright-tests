/* AI-GENERATED | Reviewed by: | Date: 2026-10-26 | Status: PENDING */

import { expect, test } from '@playwright/test';

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

test.describe('JSONPlaceholder API', () => {
  test('should return a post when requesting an existing post', async ({ request }) => {
    const response = await request.get('/posts/1');

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const post = (await response.json()) as Post;
    expect(post).toEqual(
      expect.objectContaining({
        userId: 1,
        id: 1,
        title: expect.any(String),
        body: expect.any(String),
      }),
    );
  });

  test('should return a user when requesting an existing user', async ({ request }) => {
    const response = await request.get('/users/1');

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const user = (await response.json()) as User;
    expect(user).toEqual(
      expect.objectContaining({
        id: 1,
        name: expect.any(String),
        username: expect.any(String),
        email: expect.stringMatching(/^[^@\s]+@[^@\s]+\.[^@\s]+$/),
      }),
    );
  });

  test('should return posts filtered by user id', async ({ request }) => {
    const response = await request.get('/posts', { params: { userId: 1 } });

    expect(response.status()).toBe(200);

    const posts = (await response.json()) as Post[];
    expect(posts.length).toBeGreaterThan(0);
    expect(posts.every((post) => post.userId === 1)).toBe(true);
    expect(posts.every((post) => typeof post.title === 'string' && typeof post.body === 'string')).toBe(
      true,
    );
  });
});
