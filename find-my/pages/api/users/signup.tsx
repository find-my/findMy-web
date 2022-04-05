import { NextApiRequest, NextApiResponse } from 'next';
import client from '@libs/back/client';
import bcrypt from 'bcrypt';
import protectedHandler, { ResponseType } from '@libs/back/protectedHandler';
import { withApiSession } from '@libs/back/session';
async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
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

export default withApiSession(protectedHandler({ methods: ['POST'], handler, isPrivate: false }));
