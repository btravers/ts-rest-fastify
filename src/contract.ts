import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

const postSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  body: z.string(),
});

export type PostDto = z.infer<typeof postSchema>;

export const contract = c.router(
  {
    createPost: {
      method: 'POST',
      path: '/posts',
      responses: {
        201: postSchema,
      },
      body: postSchema.pick({
        title: true,
        body: true,
      }),
      summary: 'Create a post',
    },

    getPosts: {
      method: 'GET',
      path: `/posts`,
      responses: {
        200: postSchema.array(),
      },
      summary: 'Get list of posts',
    },

    getPost: {
      method: 'GET',
      path: `/posts/:id`,
      pathParams: postSchema.pick({
        id: true,
      }),
      responses: {
        200: postSchema,
        404: z.null(),
      },
      summary: 'Get a post by id',
    },
  },
  {
    strictStatusCodes: true,
  },
);
