import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/back/protectedHandler';
import client from '@libs/back/client';
import { withApiSession } from '@libs/back/session';

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const {
    query: { id, reviewId },
  } = req;
  if (req.method === 'GET') {
    try {
      const review = await client.review.findUnique({
        where: {
          id: +reviewId.toString(),
        },
        select: {
          review: true,
          score: true,
        },
      });
      res.json({
        ok: true,
        review,
      });
    } catch {
      res.json({
        ok: false,
      });
    }
  }
  if (req.method === 'PUT') {
    const {
      body: { review, score },
    } = req;
    try {
      const updatedReview = await client.review.update({
        where: {
          id: +reviewId.toString(),
        },
        data: {
          review,
          score,
        },
      });
      res.json({
        ok: true,
        review: updatedReview,
      });
    } catch {
      res.json({
        ok: false,
      });
    }
  }
  if (req.method === 'DELETE') {
    try {
      await client.review.delete({
        where: {
          id: +reviewId.toString(),
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
    methods: ['GET', 'PUT', 'DELETE'],
    handler,
  }),
);
