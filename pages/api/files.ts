import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/back/protectedHandler';
import client from '@libs/back/client';
import { withApiSession } from '@libs/back/session';

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  if (req.method === 'GET') {
    const response = await (
      await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.IMAGE_API_ID}/images/v2/direct_upload`, {
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
  if (req.method === 'DELETE') {
    const {
      body: { deleteFileId },
    } = req;
    console.log(deleteFileId);

    const response = await (
      await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.IMAGE_API_ID}/images/v1/${deleteFileId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${process.env.IMAGE_TOKEN}`,
          },
        },
      )
    ).json();
    res.json({
      ok: true,
      ...response.success,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ['GET', 'DELETE'],
    handler,
  }),
);
