import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/back/protectedHandler';
import client from '@libs/back/client';
import { withApiSession } from '@libs/back/session';

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const {
    query: { id, commentId },
    session: { user },
    body: { reComment },
  } = req;

  const newReComment = await client.reComment.create({
    data: {
      user: {
        connect: {
          id: user?.id,
        },
      },
      comment: {
        connect: {
          id: +commentId.toString(),
        },
      },
      content: reComment,
    },
  });

  console.log(newReComment);
  res.json({
    ok: true,
    reComment: newReComment,
  });
}

export default withApiSession(
  withHandler({
    methods: ['POST'],
    handler,
  }),
);
