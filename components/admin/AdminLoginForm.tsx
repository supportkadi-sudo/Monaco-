'use client';

import { FormEvent, useState } from 'react';

export function AdminLoginForm() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    const data = new FormData(event.currentTarget);

    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: data.get('email'), password: data.get('password') })
    });

    const result = await response.json().catch(() => ({ message: 'Ошибка авторизации' }));
    if (!response.ok) {
      setError(result.message || 'Неверный логин или пароль');
      setLoading(false);
      return;
    }

    window.location.href = '/admin';
  }

  return (
    <form onSubmit={submit}>
      <label className="field">
        <span>Email</span>
        <input type="email" name="email" autoComplete="username" required />
      </label>
      <label className="field">
        <span>Пароль</span>
        <input type="password" name="password" autoComplete="current-password" required />
      </label>
      {error ? <p className="form-message form-message--error" role="alert">{error}</p> : null}
      <button type="submit" disabled={loading}>{loading ? 'Входим…' : 'Войти'}</button>
    </form>
  );
}
