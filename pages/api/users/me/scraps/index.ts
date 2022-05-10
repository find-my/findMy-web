import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/back/protectedHandler';
import client from '@libs/back/client';
import { withApiSession } from '@libs/back/session';

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const {
    session: { user },
  } = req;
  try {
    const scraps = await client.scrap.findMany({
      where: {
        userId: user?.id,
      },
      include: {
        post: true,
      },
    });
    res.json({
      ok: true,
      scraps,
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
