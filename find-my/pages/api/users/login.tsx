import { NextApiRequest, NextApiResponse } from 'next';
import client from '@libs/back/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import protectedHandler, { ResponseType } from '@libs/back/protectedHandler';
async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const { email, password } = req.body;

  const user = await client.user.findUnique({
    where: {
      ...(email ? { email } : {}),
    },
  });
  if (!user) {
    return res.status(405).json({
      ok: false,
      error: '사용자를 찾을 수 없습니다',
    });
  }
  const passwordOk = await bcrypt.compare(password, user?.password);
  if (!passwordOk) {
    return res.status(405).json({
      ok: false,
      error: '비밀번호가 일치 하지 않습니다.',
    });
  }
  const jwt_key = process.env.JWT_KEY;
  if (!jwt_key)
    return res.status(405).json({
      ok: false,
      error: '알 수 없는 오류가 발생했습니다.',
    });
  const token = await jwt.sign({ id: user.id }, jwt_key);

  return res.status(200).json({
    ok: true,
    user,
    token,
  });
}

export default protectedHandler('POST', handler);
