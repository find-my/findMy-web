import { NextApiRequest, NextApiResponse } from 'next';
type method = 'GET' | 'POST' | 'DELETE';
export interface ResponseType {
  ok: boolean;
  [key: string]: any;
}
interface ConfigType {
  methods: method[];
  handler: (req: NextApiRequest, res: NextApiResponse) => void;
  isPrivate?: boolean;
}
export default function protectedHandler({ methods, isPrivate = true, handler }: ConfigType) {
  return async function (req: NextApiRequest, res: NextApiResponse): Promise<any> {
    if (req.method && !methods.includes(req.method as any)) {
      return res.status(405).end();
    }
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
