import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/back/protectedHandler';
import client from '@libs/back/client';
import { withApiSession } from '@libs/back/session';

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const {
    query: { commentId },
  } = req;

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

export default withApiSession(
  withHandler({
    methods: ['POST'],
    handler,
  }),
);
