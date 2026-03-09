import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function IndexPage() {
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

  // Not logged in -> Landing page
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 text-center">
      <div className="max-w-3xl space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="bg-indigo-100 dark:bg-indigo-900/40 p-4 rounded-full w-24 h-24 mx-auto flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
          Twoja Nowoczesna Biblioteka
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Zarządzaj swoimi wypożyczeniami, rezerwuj nowości i odkrywaj niezwykłe tytuły z naszego katalogu.
        </p>
        <div className="flex gap-4 justify-center pt-8">
          <a href="/login" className="px-8 py-3 rounded-full font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-1">
            Zaloguj się
          </a>
          <a href="/register" className="px-8 py-3 rounded-full font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-gray-800 dark:text-indigo-400 dark:hover:bg-gray-700 shadow-md transition-all transform hover:-translate-y-1">
            Dołącz do nas
          </a>
        </div>
      </div>
    </div>
  )
}
