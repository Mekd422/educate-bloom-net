import { useState, useEffect } from 'react'
import { supabase, Course } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          instructor:users(*)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setCourses(data || [])
    } catch (error: any) {
      toast({
        title: "Error loading courses",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const createCourse = async (courseData: Omit<Course, 'id' | 'created_at' | 'updated_at' | 'instructor'>) => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert(courseData)
        .select()
        .single()

      if (error) throw error

      toast({
        title: "Course created successfully",
        description: `${courseData.title} has been added to your courses.`,
      })

      fetchCourses() // Refresh the list
      return data
    } catch (error: any) {
      toast({
        title: "Error creating course",
        description: error.message,
        variant: "destructive",
      })
      throw error
    }
  }

  const updateCourse = async (courseId: string, updates: Partial<Course>) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update(updates)
        .eq('id', courseId)

      if (error) throw error

      toast({
        title: "Course updated successfully",
      })

      fetchCourses() // Refresh the list
    } catch (error: any) {
      toast({
        title: "Error updating course",
        description: error.message,
        variant: "destructive",
      })
      throw error
    }
  }

  const deleteCourse = async (courseId: string) => {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId)

      if (error) throw error

      toast({
        title: "Course deleted successfully",
      })

      fetchCourses() // Refresh the list
    } catch (error: any) {
      toast({
        title: "Error deleting course",
        description: error.message,
        variant: "destructive",
      })
      throw error
    }
  }

  return {
    courses,
    loading,
    createCourse,
    updateCourse,
    deleteCourse,
    fetchCourses,
  }
}