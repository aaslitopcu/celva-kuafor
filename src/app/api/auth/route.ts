import { NextResponse } from "next/server";
import {
  createSession,
  destroySession,
  isAuthenticated,
  verifyPassword,
} from "@/lib/auth";

export async function GET() {
  return NextResponse.json({ authenticated: await isAuthenticated() });
}

export async function POST(request: Request) {
  const body = await request.json();
  const password = body.password as string;
  if (!(await verifyPassword(password))) {
    return NextResponse.json({ error: "Hatalı şifre" }, { status: 401 });
  }
  await createSession();
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await destroySession();
  return NextResponse.json({ ok: true });
}
