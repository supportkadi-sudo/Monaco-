'use client';

export function AdminLogoutButton() {
  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  }

  return <button type="button" onClick={logout}>Выйти</button>;
}
