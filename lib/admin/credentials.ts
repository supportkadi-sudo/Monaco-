import { compare } from 'bcryptjs';
import { prisma } from '@/lib/db';

export async function verifyAdminCredentials(emailInput: string, password: string) {
  const email = emailInput.trim().toLowerCase();
  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin) return null;
  const valid = await compare(password, admin.passwordHash);
  return valid ? admin : null;
}
