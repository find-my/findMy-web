import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/back/protectedHandler';
import client from '@libs/back/client';
import { withApiSession } from '@libs/back/session';

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const {
    query: { id },
  } = req;
  try {
    const postList = await client.post.findMany({
      where: {
        userId: +id.toString(),
      },
      include: {
        user: {
          select: {
            name: true,
            id: true,
            avatar: true,
          },
        },
        photos: {
          select: {
            file: true,
            id: true,
          },
        },
        _count: {
          select: {
            scraps: true,
            comments: true,
          },
        },
        comments: {
          select: {
            _count: {
              select: {
                reComments: true,
              },
            },
          },
        },
      },
    });
    res.json({
      ok: true,
      postList,
    });
  } catch {
    res.json({
      ok: false,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ['GET'],
    handler,
  }),
);
