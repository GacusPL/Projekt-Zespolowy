'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteBook(prevState: any, formData: FormData) {
  const bookId = formData.get('bookId') as string
  if (!bookId) return { error: 'Brak ID' }

  const supabaseServer = await createClient()
  
  const { error } = await supabaseServer.from('books').delete().eq('id', bookId)
  
  if (error) {
    if (error.code === '23503') {
      return { error: 'Książka posiada przypisane rezerwacje. Nie można jej usunąć.' }
    }
    return { error: error.message }
  }
  
  revalidatePath('/admin/books')
  return { error: null }
}

export async function addBook(formData: FormData) {
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
    available_copies: total_copies,
    description
  })
  
  revalidatePath('/admin/books')
}