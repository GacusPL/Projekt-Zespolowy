import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'

export default async function AdminBooksPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch books
  const { data: books, error } = await supabase
    .from('books')
    .select('*')
    .order('created_at', { ascending: false })

  async function deleteBook(formData: FormData) {
    'use server'
    const bookId = formData.get('bookId') as string
    if (!bookId) return

    const supabaseServer = await createClient()
    await supabaseServer.from('books').delete().eq('id', bookId)
    revalidatePath('/admin/books')
  }

  async function addBook(formData: FormData) {
    'use server'
    const title = formData.get('title') as string
    const author = formData.get('author') as string
    const category = formData.get('category') as string
    const total_copies = parseInt(formData.get('total_copies') as string)
    const description = formData.get('description') as string

    if (!title || !author || !category || isNaN(total_copies)) return

    const supabaseServer = await createClient()
    await supabaseServer.from('books').insert({
      title,
      author,
      category,
      total_copies,
      available_copies: total_copies, // Przy dodawaniu wszystkie są dostępne
      description
    })
    
    revalidatePath('/admin/books')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Zarządzanie Książkami</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Dodawaj nowe pozycje i zarządzaj istniejącymi.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formularz dodawania */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Dodaj nową książkę</h2>
            <form action={addBook} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="title">Tytuł</label>
                <input required type="text" name="title" id="title" className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 dark:text-white dark:ring-gray-600 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="author">Autor</label>
                <input required type="text" name="author" id="author" className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 dark:text-white dark:ring-gray-600 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="category">Kategoria</label>
                <input required type="text" name="category" id="category" className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 dark:text-white dark:ring-gray-600 sm:text-sm" placeholder="np. Fantastyka, IT, Kryminał" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="total_copies">Ilość egzemplarzy</label>
                <input required type="number" min="1" defaultValue="1" name="total_copies" id="total_copies" className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 dark:text-white dark:ring-gray-600 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="description">Opis</label>
                <textarea rows={3} name="description" id="description" className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 dark:text-white dark:ring-gray-600 sm:text-sm" />
              </div>
              <button type="submit" className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 transition-colors">
                Dodaj książkę
              </button>
            </form>
          </div>
        </div>

        {/* Lista książek */}
        <div className="lg:col-span-2">
          {error ? (
            <div className="rounded-md bg-red-50 p-4">Wystąpił błąd podczas ładowania książek.</div>
          ) : !books || books.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">W bazie nie ma żadnych książek.</div>
          ) : (
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {books.map(book => (
                  <li key={book.id} className="p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{book.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{book.author} — {book.category}</p>
                      <div className="mt-2 flex gap-2 text-xs font-semibold">
                        <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-700 dark:text-gray-300">Stan: {book.available_copies}/{book.total_copies}</span>
                      </div>
                    </div>
                    <form action={deleteBook}>
                      <input type="hidden" name="bookId" value={book.id} />
                      <button type="submit" className="text-sm text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 font-medium">
                        Usuń (ostrożnie!)
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
