import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface User {
  id: string
  name: string
  email: string
  role: 'student' | 'instructor'
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  title: string
  description: string
  thumbnail: string
  instructor_id: string
  instructor?: User
  price: number
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  category: string
  rating: number
  students: number
  created_at: string
  updated_at: string
}

export interface Lesson {
  id: string
  title: string
  content: string
  video_url?: string
  course_id: string
  order: number
  created_at: string
}

export interface Enrollment {
  id: string
  user_id: string
  course_id: string
  enrolled_at: string
  progress: number
}