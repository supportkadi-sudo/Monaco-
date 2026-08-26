import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminSession } from '@/lib/auth';
import { verifyAdminCredentials } from '@/lib/admin/credentials';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export async function POST(request: NextRequest) {
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
