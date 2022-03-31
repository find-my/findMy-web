import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/back/protectedHandler';
import client from '@libs/back/client';
import { withApiSession } from '@libs/back/session';

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const {
    query: { commentId },
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

export default withApiSession(
  withHandler({
    methods: ['POST'],
    handler,
  }),
);
