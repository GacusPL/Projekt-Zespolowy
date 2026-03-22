import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { CancelForm } from './cancel-form'

export default async function UserReservationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: reservations, error } = await supabase
    .from('reservations')
    .select(`
      *,
      book:books(id, title, author, image_url)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center rounded-md bg-yellow-50 dark:bg-yellow-900/30 px-2 py-1 text-xs font-medium text-yellow-800 dark:text-yellow-300 ring-1 ring-inset ring-yellow-600/20">Oczekująca</span>
      case 'accepted':
        return <span className="inline-flex items-center rounded-md bg-green-50 dark:bg-green-900/30 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-300 ring-1 ring-inset ring-green-600/20">Wypożyczona</span>
      case 'rejected':
        return <span className="inline-flex items-center rounded-md bg-red-50 dark:bg-red-900/30 px-2 py-1 text-xs font-medium text-red-700 dark:text-red-300 ring-1 ring-inset ring-red-600/10">Odrzucona</span>
      case 'returned':
        return <span className="inline-flex items-center rounded-md bg-gray-50 dark:bg-gray-800 px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 ring-1 ring-inset ring-gray-500/10">Zwrócona</span>
      default:
        return null
    }
  }
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Moje Rezerwacje</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Zarządzaj swoimi wypożyczeniami i śledź status rezerwacji.</p>
      </div>

      {error ? (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">Wystąpił błąd podczas ładowania rezerwacji.</p>
        </div>
      ) : !reservations || reservations.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <svg className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Brak rezerwacji</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400 mb-6">Nie masz jeszcze żadnych aktywnych ani historycznych rezerwacji.</p>
          <a href="/user/dashboard" className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors">
            Przejdź do katalogu
          </a>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {reservations.map((reservation) => (
              <div key={reservation.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-750/50 transition-colors">
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {reservation.book?.title || 'Nieznana książka'}
                  </h3>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    {reservation.book?.author || 'Nieznany autor'}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Data rezerwacji: {formatDate(reservation.created_at)}
                  </p>
                </div>
                
                <div className="flex flex-col items-start sm:items-end gap-3">
                  {getStatusBadge(reservation.status)}
                  
                  {reservation.status === 'pending' && (
                    <CancelForm reservationId={reservation.id} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}