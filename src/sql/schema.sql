-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-super-secret-jwt-token-with-at-least-32-characters-long';

-- Create custom types
CREATE TYPE user_role AS ENUM ('student', 'instructor');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role user_role DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Courses table
CREATE TABLE public.courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  thumbnail TEXT,
  instructor_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  price DECIMAL(10,2) DEFAULT 0,
  level TEXT CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')) DEFAULT 'Beginner',
  category TEXT NOT NULL,
  rating DECIMAL(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  students INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Lessons table
CREATE TABLE public.lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  video_url TEXT,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enrollments table
CREATE TABLE public.enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  progress DECIMAL(5,2) DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  UNIQUE(user_id, course_id)
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Courses policies
CREATE POLICY "Anyone can view courses" ON public.courses
  FOR SELECT USING (true);

CREATE POLICY "Instructors can create courses" ON public.courses
  FOR INSERT WITH CHECK (
    auth.uid() = instructor_id AND 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'instructor')
  );

CREATE POLICY "Instructors can update their own courses" ON public.courses
  FOR UPDATE USING (
    auth.uid() = instructor_id AND 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'instructor')
  );

CREATE POLICY "Instructors can delete their own courses" ON public.courses
  FOR DELETE USING (
    auth.uid() = instructor_id AND 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'instructor')
  );

-- Lessons policies
CREATE POLICY "Anyone can view lessons" ON public.lessons
  FOR SELECT USING (true);

CREATE POLICY "Course instructors can manage lessons" ON public.lessons
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.courses 
      WHERE courses.id = lessons.course_id 
      AND courses.instructor_id = auth.uid()
    )
  );

-- Enrollments policies
CREATE POLICY "Users can view their own enrollments" ON public.enrollments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Students can enroll in courses" ON public.enrollments
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'student')
  );

CREATE POLICY "Users can update their own enrollment progress" ON public.enrollments
  FOR UPDATE USING (auth.uid() = user_id);

-- Functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update function for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER handle_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();