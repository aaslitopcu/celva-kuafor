import { cookies } from "next/headers";
import { createHash, timingSafeEqual } from "crypto";
import { cache } from "react";

const COOKIE_NAME = "celva_admin_session";
const SESSION_VALUE = "authenticated";

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "celva2026";
}

function hash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export async function verifyPassword(password: string) {
  const expected = hash(getAdminPassword());
  const actual = hash(password);
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(actual));
  } catch {
    return false;
  }
}

export async function createSession() {
  const jar = await cookies();
  jar.set(COOKIE_NAME, hash(SESSION_VALUE + getAdminPassword()), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export const isAuthenticated = cache(async () => {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return false;
  const expected = hash(SESSION_VALUE + getAdminPassword());
  try {
    return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
});
