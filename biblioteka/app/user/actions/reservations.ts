'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type CancelReservationState = { error: string } | null

export async function cancelReservation(
  prevState: CancelReservationState,
  formData: FormData
): Promise<CancelReservationState> {
  const reservationId = formData.get('reservationId') as string
  if (!reservationId) return { error: 'Brak ID rezerwacji' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Brak autoryzacji' }

  const { data: res } = await supabase
    .from('reservations')
    .select('book_id')
    .eq('id', reservationId)
    .eq('user_id', user.id)
    .single()
  
  if (!res) {
    return { error: 'Nie znaleziono rezerwacji' }
  }

  const { error: rpcError } = await supabase.rpc('return_book_copy', { p_book_id: res.book_id })

  if (rpcError) {
    return { error: 'Błąd podczas zwalniania książki' }
  }

  const { error: deleteError } = await supabase
    .from('reservations')
    .delete()
    .eq('id', reservationId)

  if (deleteError) {
     return { error: 'Błąd podczas usuwania rezerwacji' }
  }
  
  revalidatePath('/user/reservations')
  revalidatePath('/user/dashboard')
  redirect('/user/reservations')
}