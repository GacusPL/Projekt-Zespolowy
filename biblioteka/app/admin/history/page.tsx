import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export default async function AdminHistoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: history, error } = await supabase
    .from('reservations')
    .select(`
      *,
      book:books(id, title, author),
      profile:profiles(id, username, email)
    `)
    .in('status', ['accepted', 'rejected', 'returned'])
    .order('updated_at', { ascending: false })

  async function markAsReturned(formData: FormData) {
    'use server'
    const reservationId = formData.get('reservationId') as string
    if (!reservationId) return

    const supabaseServer = await createClient()
    
    const { data: res } = await supabaseServer.from('reservations').select('book_id').eq('id', reservationId).single()
    if (res) {
      const { data: book } = await supabaseServer.from('books').select('available_copies').eq('id', res.book_id).single()
      if (book) {
        await supabaseServer.from('books').update({ available_copies: book.available_copies + 1 }).eq('id', res.book_id)
      }
    }
    
    await supabaseServer.from('reservations').update({ status: 'returned' }).eq('id', reservationId)
    revalidatePath('/admin/history')
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <span className="inline-flex items-center rounded-md bg-green-50 dark:bg-green-900/40 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-300 ring-1 ring-inset ring-green-600/20">Wypożyczone - Aktywne</span>
      case 'rejected':
        return <span className="inline-flex items-center rounded-md bg-red-50 dark:bg-red-900/40 px-2 py-1 text-xs font-medium text-red-700 dark:text-red-300 ring-1 ring-inset ring-red-600/10">Odrzucono</span>
      case 'returned':
        return <span className="inline-flex items-center rounded-md bg-gray-50 dark:bg-gray-800 px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 ring-1 ring-inset ring-gray-500/10">Zwrócono</span>
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Historia Wypożyczeń</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Przeglądaj chronologicznie historię decyzji i aktualnych wypożyczeń.</p>
      </div>

      {error ? (
        <div className="rounded-md bg-red-50 p-4">Wystąpił błąd podczas ładowania historii.</div>
      ) : !history || history.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">Brak historii.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 sm:pl-6">Czytelnik</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200">Książka</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200">Status</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200">Ostatnia zmiana</th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Akcje</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
              {history.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                    <div className="font-medium text-gray-900 dark:text-white">{record.profile?.username}</div>
                    <div className="text-gray-500 dark:text-gray-400">{record.profile?.email}</div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <div className="font-medium text-gray-900 dark:text-white">{record.book?.title}</div>
                    <div className="text-gray-500 dark:text-gray-400">{record.book?.author}</div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {getStatusBadge(record.status)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(record.updated_at)}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    {record.status === 'accepted' && (
                      <form action={markAsReturned}>
                        <input type="hidden" name="reservationId" value={record.id} />
                        <button type="submit" className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-md transition-colors">
                          Oznacz jako zwróconą
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
