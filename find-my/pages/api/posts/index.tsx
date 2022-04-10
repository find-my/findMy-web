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
    body: { title, category, description, place, latitude, longitude, photos, postType },
    session: { user },
  } = req;
  if (req.method === 'GET') {
    const postList = await client.post.findMany({
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

    if (!postList)
      return res.json({
        ok: false,
        message: '알 수 없는 오류가 발생했습니다.',
      });
    return res.json({
      ok: true,
      postList,
    });
  }

  if (req.method === 'POST') {
    if (!postType || (postType !== PostType.LOST && postType !== PostType.FOUND)) return res.json({ ok: false });
    console.log(postType === PostType.LOST, 121233135);
    const post = await client.post.create({
      data: {
        title,
        place,
        type: postType,
        latitude: +latitude || null,
        longitude: +longitude || null,
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

    if (!post) {
      return res.json({
        ok: false,
        message: '알 수 없는 오류가 발생했습니다.',
      });
    }
    //post 생성과 동시에 photo도 만듦
    photos.forEach(async (photo: string) => {
      if (!photo || !photo.trim()) return;
      try {
        await client.photo.create({
          data: {
            file: photo,
            post: {
              connect: {
                id: post.id,
              },
            },
          },
        });
      } catch {
        return res.json({
          ok: false,
          message: '알 수 없는 오류가 발생했습니다.',
        });
      }
    });

    return res.json({
      ok: true,
      post,
    });
  }
}

export default withApiSession(protectedHandler({ methods: ['GET', 'POST'], handler }));
