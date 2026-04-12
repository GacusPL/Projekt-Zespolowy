'use client'

import { useActionState } from 'react'
import { deleteBook } from './actions'

export function DeleteForm({ bookId }: { bookId: string }) {
  const [state, formAction, isPending] = useActionState(deleteBook, null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!window.confirm('Czy na pewno chcesz usunąć tę książkę? Ta akcja jest nieodwracalna.')) {
      e.preventDefault()
    }
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} className="flex flex-col items-end">
      <input type="hidden" name="bookId" value={bookId} />
      <button 
        type="submit" 
        disabled={isPending}
        className="text-sm text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? 'Usuwanie...' : 'Usuń (ostrożnie!)'}
      </button>
      {state?.error && (
        <p className="text-xs text-red-500 mt-2 max-w-[200px] text-right">{state.error}</p>
      )}
    </form>
  )
}