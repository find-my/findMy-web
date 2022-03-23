import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import client from '@libs/back/client';
import bcrypt from 'bcrypt';
import protectedHandler, { ResponseType } from '@libs/back/protectedHandler';
declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      id: number;
    };
  }
}
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
  const payload = Math.floor(100000 + Math.random() * 900000) + '';

  const token = await client.token.create({
    data: {
      payload,
      user: {
        connect: { id: user.id },
      },
    },
  });
  if (!token) {
    return res.json({
      ok: false,
      message: '알 수 없는 오류가 발생했습니다.',
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

export default withIronSessionApiRoute(protectedHandler('POST', handler), {
  cookieName: 'findMySession',
  password: '9845904809485098594385093840598df;slkgjfdl;gkfsdjg;ldfksjgdsflgjdfklgjdflgjflkgjdgd',
});
