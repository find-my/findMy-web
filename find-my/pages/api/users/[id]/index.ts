//유저데이터를 줌
import { NextApiRequest, NextApiResponse } from 'next';
import protectedHandler, { ResponseType } from '@libs/back/protectedHandler';
import client from '@libs/back/client';
import { withApiSession } from '@libs/back/session';
async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const {
    query: { id },
  } = req;
  console.log(id);
  if (req.method === 'GET') {
    const userData = await client.user.findUnique({
      where: { id: +id.toString() },
    });
    if (!userData)
      return res.json({
        ok: false,
      });
    return res.json({
      ok: true,
      userData,
    });
  }
}

export default withApiSession(protectedHandler({ methods: ['GET'], handler }));
