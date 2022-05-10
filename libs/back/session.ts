import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';
declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      id: number;
      isLoggedIn: boolean;
    };
  }
}

const cookieOptions = {
  cookieName: 'findMySession',
  password: process.env.COOKIE_PASSWORD!,
};

export function withApiSession(fn: any) {
  return withIronSessionApiRoute(fn, cookieOptions);
}

export function withSsrSession(handler: any) {
  return withIronSessionSsr(handler, cookieOptions);
}
