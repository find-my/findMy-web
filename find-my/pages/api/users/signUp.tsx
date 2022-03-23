import { NextApiRequest, NextApiResponse } from 'next';
import client from '@libs/back/client';
import bcrypt from 'bcrypt';
import protectedHandler, { ResponseType } from '@libs/back/protectedHandler';
async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const { email, password, name, phone } = req.body;

  try {
    const existingUser = await client.user.findFirst({
      where: {
        ...(email ? { email } : {}),
      },
    });
    if (existingUser) {
      return res.status(405).json({
        ok: false,
        error: '이미 존재하는 이메일 입니다.',
      });
    }
    const protecedPassword = await bcrypt.hash(password, 10);
    await client.user.create({
      data: {
        name,
        email,
        phone,
        password: protecedPassword,
      },
    });
    return {
      ok: true,
    };
  } catch (e) {
    return {
      ok: false,
      error: '계정 생성에 실패 했습니다.',
    };
  }
}

export default protectedHandler('POST', handler);
