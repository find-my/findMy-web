import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/back/protectedHandler';
import client from '@libs/back/client';
import { withApiSession } from '@libs/back/session';

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const {
    query: { id },
    session: { user },
  } = req;
  const alreadyExists = await client.scrap.findFirst({
    where: {
      postId: +id.toString(),
      userId: user?.id,
    },
  });
  if (alreadyExists) {
    await client.scrap.delete({
      where: {
        id: alreadyExists.id,
      },
    });
  } else {
    await client.scrap.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
        post: {
          connect: {
            id: +id.toString(),
          },
        },
      },
    });
  }
  res.json({ ok: true });
}

export default withApiSession(
  withHandler({
    methods: ['POST'],
    handler,
  }),
);
