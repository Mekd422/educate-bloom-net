import { useState, useEffect } from 'react'
import { supabase, Enrollment, Course } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'

export const useEnrollments = () => {
  const [enrollments, setEnrollments] = useState<(Enrollment & { course: Course })[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  const fetchEnrollments = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          course:courses(*)
        `)
        .eq('user_id', user.id)
        .order('enrolled_at', { ascending: false })

      if (error) throw error
      setEnrollments(data || [])
    } catch (error: any) {
      toast({
        title: "Error loading enrollments",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEnrollments()
  }, [user])

  const enrollInCourse = async (courseId: string) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to enroll in courses.",
        variant: "destructive",
      })
      return
    }

    try {
      // Check if already enrolled
      const { data: existingEnrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single()

      if (existingEnrollment) {
        toast({
          title: "Already enrolled",
          description: "You are already enrolled in this course.",
          variant: "destructive",
        })
        return
      }

      const { error } = await supabase
        .from('enrollments')
        .insert({
          user_id: user.id,
          course_id: courseId,
          progress: 0,
        })

      if (error) throw error

      toast({
        title: "Enrolled successfully",
        description: "You can now access the course content!",
      })

      fetchEnrollments() // Refresh the list
    } catch (error: any) {
      toast({
        title: "Error enrolling in course",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const updateProgress = async (enrollmentId: string, progress: number) => {
    try {
      const { error } = await supabase
        .from('enrollments')
        .update({ progress })
        .eq('id', enrollmentId)

      if (error) throw error

      fetchEnrollments() // Refresh the list
    } catch (error: any) {
      toast({
        title: "Error updating progress",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const isEnrolled = (courseId: string) => {
    return enrollments.some(enrollment => enrollment.course_id === courseId)
  }

  return {
    enrollments,
    loading,
    enrollInCourse,
    updateProgress,
    isEnrolled,
    fetchEnrollments,
  }
}