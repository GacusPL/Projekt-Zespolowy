'use client'

import { useActionState } from 'react'
import { cancelReservation } from '@/app/user/actions/reservations'

export function CancelForm({ reservationId }: { reservationId: string }) {
  const [state, formAction, isPending] = useActionState(cancelReservation, null)

  return (
    <form action={formAction} className="flex flex-col items-end">
      <input type="hidden" name="reservationId" value={reservationId} />
      <button
        type="submit"
        disabled={isPending}
        className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 underline decoration-red-200 dark:decoration-red-900 underline-offset-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? 'Anulowanie...' : 'Anuluj rezerwację'}
      </button>
      {state?.error && (
        <p className="mt-1 text-xs text-red-600 font-medium text-right">{state.error}</p>
      )}
    </form>
  )
}