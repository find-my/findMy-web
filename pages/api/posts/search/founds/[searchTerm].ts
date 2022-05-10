import { NextApiRequest, NextApiResponse } from 'next';
import client from '@libs/back/client';
import bcrypt from 'bcrypt';
import protectedHandler, { ResponseType } from '@libs/back/protectedHandler';
import { withApiSession } from '@libs/back/session';
import { PostType } from '@prisma/client';

const terms = (filterWord: string, searchTerm: string) => {
  return searchTerm.split(' ').map((word) => ({
    [filterWord]: {
      contains: word,
    },
  }));
};
async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const {
    query: { searchTerm },
  } = req;
  console.log(searchTerm);

  const containDescription = terms('title', searchTerm.toString());
  const containTitle = terms('description', searchTerm.toString());
  const containCategory = terms('category', searchTerm.toString());

  const result = await client.post.findMany({
    where: {
      type: PostType.FOUND,
      OR: [...containDescription, ...containTitle, ...containCategory],
    },
    include: {
      user: {
        select: {
          name: true,
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
      photos: {
        select: {
          file: true,
        },
      },
    },
  });

  return res.json({
    ok: true,
    postList: result,
  });
}

export default withApiSession(protectedHandler({ methods: ['GET'], handler }));
/* 
 
*/
