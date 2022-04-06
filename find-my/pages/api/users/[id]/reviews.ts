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
      const reviews = await client.review.findMany({
        where: {
          createdForId: +id.toString(),
        },
        include: { createdBy: { select: { id: true, name: true, avatar: true } } },
      });
      res.json({
        ok: true,
        reviews,
      });
    } catch {
      res.json({
        ok: false,
      });
    }
  }
  if (req.method === 'POST') {
    const {
      body: { review },
    } = req;
    try {
      const reviews = await client.review.create({
        data: {
          createdBy: {
            connect: {
              id: user?.id,
            },
          },
          createdFor: {
            connect: {
              id: +id.toString(),
            },
          },
          review,
        },
      });
      res.json({
        ok: true,
        reviews,
      });
    } catch {
      res.json({
        ok: false,
      });
    }
  }
}

export default withApiSession(
  withHandler({
    methods: ['GET', 'POST'],
    handler,
  }),
);
