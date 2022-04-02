import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/back/protectedHandler';
import client from '@libs/back/client';
import { withApiSession } from '@libs/back/session';

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const {
    query: { commentId },
  } = req;
  if (req.method === 'GET') {
    try {
      const comment = await client.comment.findUnique({
        where: {
          id: +commentId.toString(),
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              reComments: true,
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
        },
      });

      return res.json({ ok: true, comment });
    } catch (error) {
      return res.json({ ok: false, message: '예상치 못한 오류가 발생했습니다.' });
    }
  }
  if (req.method === 'PUT') {
    const {
      body: { comment },
    } = req;
    console.log('hello', comment);
    try {
      await client.comment.update({
        where: {
          id: +commentId,
        },
        data: {
          content: `${comment}`,
        },
      });
      res.json({ ok: true, comment: comment.toString() });
    } catch (error) {
      console.log(error);
      res.json({ ok: false });
    }
  }
  if (req.method === 'DELETE') {
    try {
      await client.comment.delete({
        where: {
          id: +commentId,
        },
      });
      res.json({ ok: true });
    } catch {
      res.json({ ok: false });
    }
  }
}

export default withApiSession(
  withHandler({
    methods: ['DELETE', 'PUT', 'GET'],
    handler,
  }),
);
