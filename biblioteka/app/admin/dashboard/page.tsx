import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/user/dashboard')
  }

  const { count: booksCount } = await supabase.from('books').select('*', { count: 'exact', head: true })
  const { count: pendingCount } = await supabase.from('reservations').select('*', { count: 'exact', head: true }).eq('status', 'pending')
  const { count: acceptedCount } = await supabase.from('reservations').select('*', { count: 'exact', head: true }).eq('status', 'accepted')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Panel Administratora</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Zarządzaj zasobami biblioteki i wypożyczeniami.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-center items-center text-center">
          <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-xl mb-4 text-indigo-600 dark:text-indigo-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">{booksCount || 0}</p>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Książki w bazie</p>
          <Link href="/admin/books" className="mt-4 text-sm text-indigo-600 hover:text-indigo-500 font-medium">Zarządzaj &rarr;</Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-center items-center text-center relative overflow-hidden">
          {pendingCount ? pendingCount > 0 && (
            <div className="absolute top-0 right-0 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">Nowe</div>
          ) : null}
          <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-xl mb-4 text-yellow-600 dark:text-yellow-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">{pendingCount || 0}</p>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Oczekujące rezerwacje</p>
          <Link href="/admin/reservations" className="mt-4 text-sm text-indigo-600 hover:text-indigo-500 font-medium">Rozpatrz &rarr;</Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-center items-center text-center">
          <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl mb-4 text-green-600 dark:text-green-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">{acceptedCount || 0}</p>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Aktywne wypożyczenia</p>
          <Link href="/admin/history" className="mt-4 text-sm text-indigo-600 hover:text-indigo-500 font-medium">Historia &rarr;</Link>
        </div>
      </div>
    </div>
  )
}
