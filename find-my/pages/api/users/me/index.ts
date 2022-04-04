//클라이언트쪽에서 보낸 정보 중
//기존 유저의 정보와 일치하는 부분은 업데이트 하지 않음
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
  if (req.method === 'PUT') {
    const {
      session: { user },
      body: { email, phone, name, password },
    } = req;
    const currentUser = await client.user.findUnique({
      where: {
        id: user?.id,
      },
    });

    if (email && email !== currentUser?.email) {
      const alreadyExists = Boolean(
        await client.user.findUnique({
          where: {
            email,
          },
          select: {
            id: true,
          },
        }),
      );
      if (alreadyExists) {
        return res.json({
          ok: false,
          error: '이미 존재하는 이메일입니다.',
        });
      }
      try {
        await client.user.update({
          where: {
            id: user?.id,
          },
          data: {
            email,
          },
        });
      } catch {
        return res.json({ ok: false, message: '알 수 없는 오류가 발생했습니다.' });
      }
    }
    if (phone && phone !== currentUser?.phone) {
      const alreadyExists = Boolean(
        await client.user.findUnique({
          where: {
            phone,
          },
          select: {
            id: true,
          },
        }),
      );
      if (alreadyExists) {
        return res.json({
          ok: false,
          error: '이미 사용 중인 휴대폰 번호입니다.',
        });
      }
      try {
        await client.user.update({
          where: {
            id: user?.id,
          },
          data: {
            phone,
          },
        });
      } catch {
        return res.json({ ok: false, message: '알 수 없는 오류가 발생했습니다.' });
      }
    }

    if (password && currentUser) {
      const passwordEqual = await bcrypt.compare(password, currentUser?.password);
      if (!passwordEqual) {
        const protectedNewPassword = await bcrypt.hash(password, 10);
        try {
          await client.user.update({
            where: {
              id: user?.id,
            },
            data: {
              password: protectedNewPassword,
            },
          });
        } catch {
          return res.json({ ok: false, message: '알 수 없는 오류가 발생했습니다.' });
        }
      }
    }
    //session에 저장된 유저에 이름과 아바타 정보도 추가로 넣어 주기
    if (name) {
      try {
        await client.user.update({
          where: {
            id: user?.id,
          },
          data: {
            name,
          },
        });
      } catch {
        return res.json({ ok: false, message: '알 수 없는 오류가 발생했습니다.' });
      }
    }
    return res.json({ ok: true, user });
  }
}

export default withApiSession(protectedHandler({ methods: ['GET', 'DELETE', 'PUT'], handler }));
