'use client'

import { useActionState } from 'react'
import { createReservation } from '@/app/user/actions/create-reservation'

export function ReservationForm({ bookId, disabled }: { bookId: string, disabled: boolean }) {
  const [state, formAction, isPending] = useActionState(createReservation, null)

  return (
    <form action={formAction} className="mt-auto">
      <input type="hidden" name="bookId" value={bookId} />
      <button
        type="submit"
        disabled={disabled || isPending}
        className="w-full rounded-lg bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isPending ? 'Przetwarzanie...' : (disabled ? 'Brak egzemplarzy' : 'Rezerwuj egzemplarz')}
      </button>
      {state?.error && (
        <p className="mt-2 text-sm text-red-600 font-medium text-center">{state.error}</p>
      )}
    </form>
  )
}