import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/back/protectedHandler';
import client from '@libs/back/client';
import { withApiSession } from '@libs/back/session';

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const {
    query: { reCommentId },
  } = req;
  if (req.method === 'PUT') {
    const {
      body: { reComment },
    } = req;
    console.log('hello', reComment);
    try {
      await client.reComment.update({
        where: {
          id: +reCommentId,
        },
        data: {
          content: `${reComment}`,
        },
      });
      res.json({ ok: true, reComment: reComment.toString() });
    } catch (error) {
      console.log(error);
      res.json({ ok: false });
    }
  }
  if (req.method === 'DELETE') {
    try {
      await client.reComment.delete({
        where: {
          id: +reCommentId,
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
    methods: ['DELETE', 'PUT'],
    handler,
  }),
);
