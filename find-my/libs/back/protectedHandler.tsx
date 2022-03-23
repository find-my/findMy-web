import { NextApiRequest, NextApiResponse } from 'next';

export interface ResponseType {
  ok: boolean;
  [key: string]: any;
}
interface ConfigType {
  method: 'GET' | 'POST' | 'DELETE';
  handler: (req: NextApiRequest, res: NextApiResponse) => void;
  isPrivate?: boolean;
}
export default function protectedHandler({ method, isPrivate = true, handler }: ConfigType) {
  return async function (req: NextApiRequest, res: NextApiResponse): Promise<any> {
    if (isPrivate && !req.session.user) {
      return res.status(401).json({ ok: false, message: '로그인이 필요합니다.' });
    }
    try {
      await handler(req, res);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  };
}
