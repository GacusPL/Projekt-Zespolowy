'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  const supabase = await createClient()
  
  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Fetch user role for redirect
  if (data?.user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (profile?.role === 'admin') {
      redirect('/admin/dashboard')
    } else {
      // Default to user dashboard
      redirect('/user/dashboard')
    }
  }

  redirect('/')
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = formData.get('username') as string
  const role = formData.get('role') as string || 'user'
  
  const supabase = await createClient()

  // Zarejestruj użytkownika, przekazując metadata potrzebne w triggerze SQL
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: username,
        role: role
      }
    }
  })

  if (error) {
    return { error: error.message }
  }

  // On successful signup we instruct the user to login.
  // In a real app we might verify email first.
  redirect(`/login?message=${encodeURIComponent('Konto zostało utworzone. Możesz się zalogować.')}`)
}

export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  // Clear caches and redirect
  revalidatePath('/', 'layout')
  redirect('/login')
}
