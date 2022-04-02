import { NextApiRequest, NextApiResponse } from 'next';
import protectedHandler, { ResponseType } from '@libs/back/protectedHandler';
import client from '@libs/back/client';
import { withApiSession } from '@libs/back/session';
import bcrypt from 'bcrypt';
async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  if (req.method === 'GET') {
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
  if (req.method === 'POST') {
    const { email, password, name, phone } = req.body;

    const existingUser = await client.user.findFirst({
      where: {
        ...(email ? { email } : {}),
      },
    });
    if (existingUser) {
      return res.json({
        ok: false,
        message: '이미 존재하는 이메일 입니다.',
      });
    }
    const protecedPassword = await bcrypt.hash(password, 10);
    const createdUser = await client.user.create({
      data: {
        name,
        email,
        phone,
        password: protecedPassword,
      },
    });
    if (!createdUser) {
      return res.json({
        ok: false,
        message: '계정 생성에 실패 했습니다.',
      });
    }
    return res.json({
      ok: true,
    });
  }
}

export default withApiSession(protectedHandler({ methods: ['GET', 'POST', 'DELETE', 'PUT'], handler }));
