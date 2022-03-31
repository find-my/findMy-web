import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/back/protectedHandler';
import client from '@libs/back/client';
import { withApiSession } from '@libs/back/session';

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const {
    query: { id },
    session: { user },
    body: { comment },
  } = req;

  const newComment = await client.comment.create({
    data: {
      user: {
        connect: {
          id: user?.id,
        },
      },
      lost: {
        connect: {
          id: +id.toString(),
        },
      },
      content: comment,
    },
  });

  console.log(newComment);
  res.json({
    ok: true,
    comment: newComment,
  });
}

export default withApiSession(
  withHandler({
    methods: ['POST'],
    handler,
  }),
);
