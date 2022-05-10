import type { NextRequest, NextFetchEvent } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  if (req.ua?.isBot) {
    return new Response('로봇 입니까?', { status: 403 });
  }
}
