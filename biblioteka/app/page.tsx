import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Book } from '@/types/supabase'

export const dynamic = 'force-dynamic'

export default async function IndexPage(props: {
  searchParams: Promise<{ q?: string; category?: string }>
}) {
  const searchParams = await props.searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role === 'admin') {
      redirect('/admin/dashboard')
    } else {
      redirect('/user/dashboard')
    }
  }

  const query = searchParams?.q || ''
  const category = searchParams?.category || ''

  let dbQuery = supabase
    .from('books')
    .select('*')
    .order('created_at', { ascending: false })

  if (query) {
    dbQuery = dbQuery.or(`title.ilike.%${query}%,author.ilike.%${query}%`)
  }

  if (category) {
    dbQuery = dbQuery.eq('category', category)
  }

  const { data: books, error } = await dbQuery

  const { data: categoriesData } = await supabase
    .from('books')
    .select('category')
  
  const categories = Array.from(new Set(categoriesData?.map(c => c.category) || []))

  return (
    <>
      <div className="relative bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop"
            alt="Biblioteka edukacyjna"
            className="w-full h-full object-cover opacity-20 dark:opacity-30 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-gray-50/80 dark:from-gray-900 dark:via-gray-900/40 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4 animate-in slide-in-from-bottom-4 duration-700">
              Odkryj magię <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-600 dark:from-indigo-400 dark:to-violet-400">literatury</span>
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 animate-in slide-in-from-bottom-6 duration-1000 max-w-lg">
              Przeglądaj tysiące książek online. Zanurz się w klasyce, nowościach i bestsellerach w domowym zaciszu.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Nasz Katalog</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Przeszukuj zbiory i odnajduj tytuły.</p>
          </div>
          
          <form className="flex w-full md:w-auto gap-2">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Szukaj po tytule lub autorze..."
            className="flex-1 md:w-64 rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-800 dark:ring-gray-700 dark:text-white dark:focus:ring-indigo-500 sm:text-sm"
          />
          <select
            name="category"
            defaultValue={category}
            className="rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-800 dark:ring-gray-700 dark:text-white dark:focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Wszystkie kategorie</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
          >
            Szukaj
          </button>
        </form>
      </div>

      {error ? (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">Wystąpił błąd podczas ładowania książek.</p>
        </div>
      ) : !books || books.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">Brak książek</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Nie znaleziono książek spełniających kryteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {books.map((book: Book) => (
            <div key={book.id} className="group flex flex-col justify-between overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-flex items-center rounded-md bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300 ring-1 ring-inset ring-indigo-700/10 dark:ring-indigo-400/20">
                    {book.category}
                  </span>
                  {book.available_copies > 0 ? (
                    <span className="inline-flex items-center rounded-md bg-green-50 dark:bg-green-900/30 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-300 ring-1 ring-inset ring-green-600/20">
                      Dostępne: {book.available_copies}/{book.total_copies}
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-md bg-red-50 dark:bg-red-900/30 px-2 py-1 text-xs font-medium text-red-700 dark:text-red-300 ring-1 ring-inset ring-red-600/10">
                      Niedostępne
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 line-clamp-2">{book.title}</h3>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">{book.author}</p>
                
                {book.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                    {book.description}
                  </p>
                )}
              </div>
              
              <div className="p-6 pt-0 mt-auto">
                <a href="/login" className="block w-full rounded-lg bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 text-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors">
                  Zaloguj się, aby zarezerwować
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  )
}
