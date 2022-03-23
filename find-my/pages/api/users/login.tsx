import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import client from '@libs/back/client';
import bcrypt from 'bcrypt';
import protectedHandler, { ResponseType } from '@libs/back/protectedHandler';
import { withApiSession } from '@libs/back/session';
async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const { email, password } = req.body;
  console.log('login');
  const user = await client.user.findUnique({
    where: {
      ...(email ? { email } : {}),
    },
  });
  if (!user) {
    return res.json({
      ok: false,
      message: '사용자를 찾을 수 없습니다',
    });
  }
  const passwordOk = await bcrypt.compare(password, user?.password);
  if (!passwordOk) {
    return res.json({
      ok: false,
      message: '비밀번호가 일치 하지 않습니다.',
    });
  }

  req.session.user = {
    id: user.id,
  };
  await req.session.save();
  return res.json({
    ok: true,
    user,
  });
}

export default withApiSession(protectedHandler({ method: 'POST', handler, isPrivate: false }));
