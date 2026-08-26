'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type ActionStatus = 'CONTACTED' | 'CONFIRMED' | 'CANCELLED';

const actions: Array<{ status: ActionStatus; label: string }> = [
  { status: 'CONTACTED', label: 'Связались' },
  { status: 'CONFIRMED', label: 'Подтвердить' },
  { status: 'CANCELLED', label: 'Отменить' }
];

export function BookingStatusActions({ bookingId }: { bookingId: number }) {
  const router = useRouter();
  const [pending, setPending] = useState<ActionStatus | null>(null);

  async function change(status: ActionStatus) {
    setPending(status);
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error('Status update failed');
      router.refresh();
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="status-actions">
      {actions.map((action) => (
        <button key={action.status} type="button" disabled={pending !== null} onClick={() => change(action.status)}>
          {pending === action.status ? '…' : action.label}
        </button>
      ))}
    </div>
  );
}
