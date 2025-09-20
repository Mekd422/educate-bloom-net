import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import CourseCard from "@/components/CourseCard";
import AuthModal from "@/components/AuthModal";
import { useCourses } from "@/hooks/useCourses";
import { useAuth } from "@/hooks/useAuth";
import heroImage from "@/assets/hero-learning.jpg";
import { Search, BookOpen, Users, Award, Zap, Plus, Settings, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { courses, loading } = useCourses();
  const { user } = useAuth();

  const handleEnroll = (courseId: string) => {
    if (!user) {
      setIsAuthModalOpen(true);
    }
    // Enrollment is handled in CourseCard component
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation onAuthClick={() => setIsAuthModalOpen(true)} />
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  🎓 Learn from Industry Experts
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Master New Skills with{" "}
                  <span className="bg-gradient-primary bg-clip-text text-transparent">
                    LearnHub
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Join thousands of students learning from world-class instructors. 
                  Build real projects, earn certificates, and advance your career.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-primary hover:opacity-90 shadow-elegant"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  {user ? "Continue Learning" : "Start Learning Today"}
                </Button>
                <Button size="lg" variant="outline">
                  Browse Courses
                </Button>
              </div>

              {user && user.role === 'instructor' && (
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Instructor Dashboard</h3>
                      <p className="text-sm text-muted-foreground">Manage your courses and track student progress</p>
                    </div>
                    <div className="flex gap-2">
                      <Button asChild size="sm">
                        <Link to="/instructor/dashboard">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Dashboard
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link to="/instructor/create-course">
                          <Plus className="h-4 w-4 mr-2" />
                          Create Course
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-8 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>50K+ Students</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4" />
                  <span>200+ Courses</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4" />
                  <span>Industry Certified</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-3xl opacity-20" />
              <img
                src={heroImage}
                alt="Students learning online"
                className="relative rounded-2xl shadow-elegant w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="What do you want to learn today?"
                className="pl-12 h-14 text-lg"
              />
              <Button 
                size="lg" 
                className="absolute right-2 top-2 bg-gradient-primary"
                disabled
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section id="courses" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-success/10 text-success border-success/20">
              ⭐ Most Popular
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold">
              Featured Courses
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Hand-picked courses from our top-rated instructors to help you achieve your learning goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-muted rounded-lg h-64 mb-4" />
                  <div className="space-y-2">
                    <div className="bg-muted rounded h-4 w-3/4" />
                    <div className="bg-muted rounded h-4 w-1/2" />
                  </div>
                </div>
              ))
            ) : courses.length > 0 ? (
              courses.slice(0, 4).map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onEnroll={handleEnroll}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No courses available</h3>
                <p className="text-muted-foreground mb-4">
                  {user?.role === 'instructor' 
                    ? "Create your first course to get started!" 
                    : "Check back soon for new courses!"
                  }
                </p>
                {user?.role === 'instructor' && (
                  <Button asChild>
                    <Link to="/instructor/create-course">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Course
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline">
              View All Courses
            </Button>
          </div>
        </div>
      </section>

      {/* Supabase Integration CTA */}
      <section className="py-20 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="flex justify-center">
              <Badge className="bg-primary/10 text-primary border-primary/20 text-lg px-4 py-2">
                <Zap className="h-4 w-4 mr-2" />
                Ready to Enable Full Functionality?
              </Badge>
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-bold">
              Connect to Supabase for Complete Features
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              This beautiful frontend is ready! Connect to Supabase to enable user authentication, 
              course enrollment, progress tracking, and instructor dashboards.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="p-6 bg-background rounded-lg shadow-soft">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">User Management</h3>
                <p className="text-sm text-muted-foreground">
                  Student & instructor accounts with role-based access
                </p>
              </div>
              
              <div className="p-6 bg-background rounded-lg shadow-soft">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Course Management</h3>
                <p className="text-sm text-muted-foreground">
                  Create, edit, and organize courses with lessons and videos
                </p>
              </div>
              
              <div className="p-6 bg-background rounded-lg shadow-soft">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Progress Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Track student progress and issue certificates
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                LearnHub
              </span>
            </div>
            <p className="text-muted-foreground text-center">
              © 2024 LearnHub. Built with Lovable. Ready for Supabase integration.
            </p>
          </div>
        </div>
      </footer>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default Index;