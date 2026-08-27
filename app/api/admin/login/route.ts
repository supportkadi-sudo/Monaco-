import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminSession } from '@/lib/auth';
import { verifyAdminCredentials } from '@/lib/admin/credentials';
import { checkAdminLoginRateLimit } from '@/lib/rate-limit';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const limit = checkAdminLoginRateLimit(ip);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, message: 'Слишком много попыток входа. Попробуйте позже.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
    );
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: 'Проверьте логин и пароль' }, { status: 400 });
  }

  const admin = await verifyAdminCredentials(parsed.data.email, parsed.data.password);
  if (!admin) {
    return NextResponse.json({ ok: false, message: 'Неверный логин или пароль' }, { status: 401 });
  }

  await createAdminSession(admin.id);
  return NextResponse.json({ ok: true });
}
