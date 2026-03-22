'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type ReservationState = { error: string } | null

export async function createReservation(
  prevState: ReservationState, 
  formData: FormData
): Promise<ReservationState> {
  const bookId = formData.get('bookId') as string
  if (!bookId) return { error: 'Brak ID książki.' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Brak autoryzacji.' }

  const { data: success, error } = await supabase.rpc('reserve_book', {
    p_book_id: bookId,
    p_user_id: user.id
  })

  if (error || !success) {
    return { error: 'Nie udało się zarezerwować. Brak dostępnych egzemplarzy lub błąd serwera.' }
  }

  revalidatePath('/user/dashboard')
  redirect('/user/reservations')
}