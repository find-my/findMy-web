import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/back/protectedHandler';
import client from '@libs/back/client';
import { withApiSession } from '@libs/back/session';

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const {
    query: { id },
    session: { user },
  } = req;
  if (req.method === 'GET') {
    try {
      const lost = await client.lost.findUnique({
        where: {
          id: +id.toString(),
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          photos: {
            select: {
              file: true,
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
              id: true,
              createdAt: true,
              updatedAt: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  avatar: true,
                },
              },
              content: true,
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
          },
        },
      });
      const isScraped = Boolean(
        await client.scrap.findFirst({
          where: {
            lostId: lost?.id,
            userId: user?.id,
          },
          select: {
            id: true,
          },
        }),
      );
      console.log(lost?.comments[0]?.reComments);
      return res.json({ ok: true, lost, isScraped });
    } catch (error) {
      return res.json({ ok: false, message: '예상치 못한 오류가 발생했습니다.' });
    }
  } else if (req.method === 'POST') {
    const data = req.body;
    console.log(data);
    try {
      await client.lost.update({
        where: { id: +id.toString() },
        data,
      });
      res.json({
        ok: true,
      });
    } catch {
      res.json({ ok: false, message: '예상치 못한 오류가 발생했습니다.' });
    }
  }
}

export default withApiSession(
  withHandler({
    methods: ['POST', 'GET'],
    handler,
  }),
);
