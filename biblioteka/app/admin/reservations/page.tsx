import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export default async function AdminReservationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: reservations, error } = await supabase
    .from('reservations')
    .select(`
      *,
      book:books(id, title, author),
      profile:profiles(id, username, email)
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  async function processReservation(formData: FormData) {
    'use server'
    const reservationId = formData.get('reservationId') as string
    const action = formData.get('action') as string
    if (!reservationId || !action) return

    const supabaseServer = await createClient()
    
    if (action === 'accept') {
      await supabaseServer.from('reservations').update({ status: 'accepted' }).eq('id', reservationId)
    } else if (action === 'reject') {
      const { data: res } = await supabaseServer.from('reservations').select('book_id').eq('id', reservationId).single()
      if (res) {
        const { data: book } = await supabaseServer.from('books').select('available_copies').eq('id', res.book_id).single()
        if (book) {
          await supabaseServer.from('books').update({ available_copies: book.available_copies + 1 }).eq('id', res.book_id)
        }
      }
      await supabaseServer.from('reservations').update({ status: 'rejected' }).eq('id', reservationId)
    }
    
    revalidatePath('/admin/reservations')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Oczekujące Rezerwacje</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Akceptuj lub odrzucaj zlecenia czytelników.</p>
      </div>

      {error ? (
        <div className="rounded-md bg-red-50 p-4">Wystąpił błąd podczas ładowania danych.</div>
      ) : !reservations || reservations.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <svg className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Wszystko gotowe!</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Nie ma obecnie żadnych oczekujących rezerwacji do rozpatrzenia.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {reservations.map((reservation) => (
              <li key={reservation.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">Czytelnik: {reservation.profile?.username} ({reservation.profile?.email})</p>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{reservation.book?.title}</h3>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{reservation.book?.author}</p>
                    <p className="text-xs text-gray-400">Złożono: {formatDate(reservation.created_at)}</p>
                  </div>
                  
                  <div className="flex gap-3">
                    <form action={processReservation}>
                      <input type="hidden" name="reservationId" value={reservation.id} />
                      <input type="hidden" name="action" value="accept" />
                      <button type="submit" className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 transition-colors">
                        Akceptuj
                      </button>
                    </form>
                    <form action={processReservation}>
                      <input type="hidden" name="reservationId" value={reservation.id} />
                      <input type="hidden" name="action" value="reject" />
                      <button type="submit" className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 transition-colors">
                        Odrzuć
                      </button>
                    </form>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
