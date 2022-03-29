import { NextApiRequest, NextApiResponse } from 'next';
import client from '@libs/back/client';
import bcrypt from 'bcrypt';
import protectedHandler, { ResponseType } from '@libs/back/protectedHandler';
import { withApiSession } from '@libs/back/session';
async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  //views 기능 추가 필요
  const {
    body: { title, category, description, lostPlace },
    session: { user },
  } = req;
  if (req.method === 'GET') {
    const lostList = await client.lost.findMany({
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });
    console.log(lostList);
    if (!lostList)
      return res.json({
        ok: false,
        message: '알 수 없는 오류가 발생했습니다.',
      });
    return res.json({
      ok: true,
      lostList,
    });
  }
  if (req.method === 'POST') {
    const lost = await client.lost.create({
      data: {
        title,
        lostPlace,
        description,
        category,
        views: 0,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    if (!lost) {
      return res.json({
        ok: false,
        message: '알 수 없는 오류가 발생했습니다.',
      });
    }
    return res.json({
      ok: true,
      lost,
    });
  }
}

export default withApiSession(protectedHandler({ methods: ['GET', 'POST'], handler }));
