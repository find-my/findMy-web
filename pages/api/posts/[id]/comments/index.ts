import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/back/protectedHandler';
import client from '@libs/back/client';
import { withApiSession } from '@libs/back/session';

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const {
    query: { id },
    session: { user },
    body: { comment },
  } = req;
  if (req.method === 'GET') {
    try {
      const comments = await client.comment.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          reComments: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  avatar: true,
                },
              },
            },
          },
          _count: {
            select: {
              reComments: true,
            },
          },
        },
      });
      return res.json({
        ok: true,
        comments,
      });
    } catch {
      return res.json({
        ok: false,
      });
    }
  }
  if (req.method === 'POST') {
    const newComment = await client.comment.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
        post: {
          connect: {
            id: +id.toString(),
          },
        },
        content: comment,
      },
    });

    console.log(newComment);
    res.json({
      ok: true,
      comment: newComment,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ['POST', 'GET'],
    handler,
  }),
);
