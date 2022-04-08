import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/back/protectedHandler';
import client from '@libs/back/client';
import { withApiSession } from '@libs/back/session';
import { LostPhoto } from '@prisma/client';

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const {
    query: { id },
    session: { user },
  } = req;
  if (req.method === 'GET') {
    try {
      const lost = await client.lost.findUnique({
        where: {
          id: +id.toString(),
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          photos: {
            select: {
              file: true,
              id: true,
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
              id: true,
              createdAt: true,
              updatedAt: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  avatar: true,
                },
              },
              content: true,
              reComments: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      avatar: true,
                    },
                  },
                },
              },
              _count: {
                select: {
                  reComments: true,
                },
              },
            },
          },
        },
      });
      const isScraped = Boolean(
        await client.scrap.findFirst({
          where: {
            lostId: lost?.id,
            userId: user?.id,
          },
          select: {
            id: true,
          },
        }),
      );
      console.log(lost?.comments[0]?.reComments);
      return res.json({ ok: true, lost, isScraped });
    } catch (error) {
      return res.json({ ok: false, message: '예상치 못한 오류가 발생했습니다.' });
    }
  }
  if (req.method === 'PUT') {
    const {
      body: { title, category, description, place, latitude, longitude, photos },
    } = req;

    try {
      const lost = await client.lost.update({
        where: { id: +id.toString() },
        data: {
          title,
          lostPlace: place,
          latitude: +latitude || null,
          longitude: +longitude || null,
          description,
          category,
        },
      });
      const prevPhotos = await client.lostPhoto.findMany({
        where: {
          lostId: +lost?.id?.toString(),
        },
        select: {
          id: true,
          file: true,
        },
      });
      console.log(prevPhotos, photos);
      [1, 1, 1].forEach(async (_, i) => {
        if (photos[i] && prevPhotos[i] && prevPhotos[i]?.file === photos[i]) return;
        else {
          //기존 사진 삭제
          if (prevPhotos[i]) {
            await client.lostPhoto.delete({
              where: {
                id: prevPhotos[i].id,
              },
            });
          } //사진 추가
          if (photos[i]) {
            await client.lostPhoto.create({
              data: {
                file: photos[i],
                lost: {
                  connect: {
                    id: lost.id,
                  },
                },
              },
            });
          }
        }
      });
      res.json({
        ok: true,
      });
    } catch {
      res.json({ ok: false, message: '예상치 못한 오류가 발생했습니다.' });
    }
  }
  if (req.method === 'DELETE') {
    try {
      await client.lost.delete({
        where: {
          id: +id.toString(),
        },
      });
      res.json({ ok: true });
    } catch {
      res.json({ ok: false });
    }
  }
}

export default withApiSession(
  withHandler({
    methods: ['GET', 'PUT', 'DELETE'],
    handler,
  }),
);
