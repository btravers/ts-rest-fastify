import { Controller } from '@nestjs/common';
import { TsRest, tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import * as crypto from 'crypto';
import { contract, PostDto } from './contract';

@Controller()
@TsRest({ validateResponses: true })
export class AppController {
  private readonly posts: PostDto[] = [];

  @TsRestHandler(contract)
  async handler() {
    return tsRestHandler(contract, {
      createPost: async ({ body }) => {
        const post = {
          ...body,
          id: crypto.randomUUID(),
        };

        this.posts.push(post);

        return {
          status: 201,
          body: post,
        };
      },

      getPosts: async ({ query }) => {
        console.log(query);

        return { status: 200, body: this.posts };
      },

      getPost: async ({ params }) => {
        const post = this.posts.find((p) => p.id === params.id);

        if (!post) {
          return { status: 404, body: null };
        }

        return { status: 200, body: post };
      },
    });
  }
}
