import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/back/protectedHandler';
import client from '@libs/back/client';
import { withApiSession } from '@libs/back/session';

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const {
    session: { user },
  } = req;
  try {
    const reviews = await client.review.findMany({
      where: {
        createdForId: user?.id,
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

export default withApiSession(
  withHandler({
    methods: ['GET'],
    handler,
  }),
);
