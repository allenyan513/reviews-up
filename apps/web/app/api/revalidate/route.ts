import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const path = body.path;
  revalidatePath(path);
  console.log('Revalidating path:', path);
  return NextResponse.json({ revalidated: true, path });
}
