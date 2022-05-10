//post get,post
//post시 photo도 동시에 생성함
import { NextApiRequest, NextApiResponse } from 'next';
import client from '@libs/back/client';
import protectedHandler, { ResponseType } from '@libs/back/protectedHandler';
import { withApiSession } from '@libs/back/session';
import { PostType } from '@prisma/client';
async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  //views 기능 추가 필요
  const {
    session: { user },
    query: { page },
  } = req;
  if (req.method === 'GET') {
    const foundList = await client.post.findMany({
      skip: (+page - 1) * 10,
      take: 10,
      where: {
        type: PostType.FOUND,
      },
      orderBy: [{ createdAt: 'desc' }],
      include: {
        user: {
          select: {
            name: true,
            id: true,
            avatar: true,
          },
        },
        photos: {
          select: {
            file: true,
          },
        },
        _count: {
          select: {
            scraps: true,
            comments: true,
          },
        },
        comments: {
          select: {
            _count: {
              select: {
                reComments: true,
              },
            },
          },
        },
      },
    });
    console.log(foundList);

    return res.json({
      ok: true,
      postList: foundList,
    });
  }
}

export default withApiSession(protectedHandler({ methods: ['GET'], handler }));
