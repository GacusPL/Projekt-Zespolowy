'use client'

import { useState } from 'react'
import { updateBook } from './actions'
import { DeleteForm } from './delete-form'

export function BookItem({ book }: { book: any }) {
  const [isEditing, setIsEditing] = useState(false)
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    const formData = new FormData(e.currentTarget)
    await updateBook(formData)
    setIsPending(false)
    setIsEditing(false)
  }

  return (
    <li className="p-6 flex flex-col hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      {isEditing ? (
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <input type="hidden" name="id" value={book.id} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Tytuł</label>
              <input required type="text" name="title" defaultValue={book.title} className="w-full rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white text-sm py-1.5 px-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Autor</label>
              <input required type="text" name="author" defaultValue={book.author} className="w-full rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white text-sm py-1.5 px-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Kategoria</label>
              <input required type="text" name="category" defaultValue={book.category} className="w-full rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white text-sm py-1.5 px-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Całk. Ilość</label>
              <input required type="number" min="1" name="total_copies" defaultValue={book.total_copies} className="w-full rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white text-sm py-1.5 px-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Opis</label>
              <textarea name="description" rows={2} defaultValue={book.description || ''} className="w-full rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white text-sm py-1.5 px-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
          </div>
          <div className="flex gap-3 justify-end mt-4">
            <button type="button" onClick={() => setIsEditing(false)} className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 font-medium">
              Anuluj
            </button>
            <button type="submit" disabled={isPending} className="px-3 py-1.5 text-sm bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium shadow-sm disabled:opacity-50 transition-colors">
              {isPending ? 'Zapisywanie...' : 'Zapisz'}
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between w-full">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{book.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{book.author} — {book.category}</p>
            <div className="mt-2 flex gap-2 text-xs font-semibold">
              <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-700 dark:text-gray-300">Stan: {book.available_copies}/{book.total_copies}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsEditing(true)} className="text-sm font-medium text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
              Edytuj
            </button>
            <DeleteForm bookId={book.id} />
          </div>
        </div>
      )}
    </li>
  )
}
