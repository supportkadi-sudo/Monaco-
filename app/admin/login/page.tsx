import { redirect } from 'next/navigation';
import { getAdmin } from '@/lib/auth';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';

export default async function AdminLoginPage() {
  const admin = await getAdmin();
  if (admin) redirect('/admin');

  return (
    <main className="login-wrap">
      <section className="login-card">
        <h1>Monaco Admin</h1>
        <p>Вход для сотрудников, которые обрабатывают заявки.</p>
        <AdminLoginForm />
      </section>
    </main>
  );
}
