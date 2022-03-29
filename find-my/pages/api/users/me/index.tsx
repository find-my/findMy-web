import { NextApiRequest, NextApiResponse } from 'next';
import protectedHandler, { ResponseType } from '@libs/back/protectedHandler';
import client from '@libs/back/client';
import { withApiSession } from '@libs/back/session';
async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  if (!req.session.user)
    return res.json({
      ok: false,
      isLoggedIn: false,
    });
  const userData = await client.user.findUnique({
    where: { id: req.session.user?.id },
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

export default withApiSession(protectedHandler({ methods: ['GET'], handler }));
