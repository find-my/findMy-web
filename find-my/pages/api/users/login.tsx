import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../libs/back/client';
import protectedHandler from '../../../libs/back/protectedHandler';
async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.body);
  return res.status(200).end();
}

export default protectedHandler('POST', handler);
