import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/back/protectedHandler';
import client from '@libs/back/client';
import { withApiSession } from '@libs/back/session';

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const response = await (
    await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.IMAGE_DELIVERY}/images/v1/direct_upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.IMAGE_TOKEN}`,
      },
    })
  ).json();

  console.log(response);

  res.json({
    ok: true,
    ...response.result,
  });
}

export default withApiSession(
  withHandler({
    methods: ['GET'],
    handler,
  }),
);
