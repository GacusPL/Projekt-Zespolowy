export type UserRole = 'user' | 'admin'

export interface Profile {
  id: string
  email: string
  username: string
  role: UserRole
  created_at: string
}

export interface Book {
  id: string
  title: string
  author: string
  category: string
  description: string | null
  total_copies: number
  available_copies: number
  image_url: string | null
  created_at: string
}

export type ReservationStatus = 'pending' | 'accepted' | 'rejected' | 'returned'

export interface Reservation {
  id: string
  user_id: string
  book_id: string
  status: ReservationStatus
  created_at: string
  updated_at: string
  // relations
  book?: Book
  profile?: Profile
}
