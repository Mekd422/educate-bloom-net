import { useAuth } from "@/hooks/useAuth";
import { useCourses } from "@/hooks/useCourses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, DollarSign, Plus, Edit, Trash2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Link } from "react-router-dom";

const InstructorDashboard = () => {
  const { user } = useAuth();
  const { courses, loading, deleteCourse } = useCourses();

  if (!user || user.role !== 'instructor') {
    return <div>Access denied</div>;
  }

  const myCourses = courses.filter(course => course.instructor_id === user.id);

  return (
    <div className="min-h-screen bg-background">
      <Navigation onAuthClick={() => {}} />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Instructor Dashboard</h1>
                <p className="text-muted-foreground">Manage your courses and track performance</p>
              </div>
              <Button asChild>
                <Link to="/instructor/create-course">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Course
                </Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">{myCourses.length}</p>
                      <p className="text-sm text-muted-foreground">Total Courses</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">
                        {myCourses.reduce((acc, course) => acc + course.students, 0)}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Students</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">
                        ${myCourses.reduce((acc, course) => acc + (course.price * course.students), 0)}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Revenue</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">
                        {myCourses.length > 0 ? (myCourses.reduce((acc, course) => acc + course.rating, 0) / myCourses.length).toFixed(1) : 0}
                      </p>
                      <p className="text-sm text-muted-foreground">Avg Rating</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-6">Your Courses</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="bg-muted rounded h-32 mb-4" />
                        <div className="space-y-2">
                          <div className="bg-muted rounded h-4 w-3/4" />
                          <div className="bg-muted rounded h-4 w-1/2" />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : myCourses.length > 0 ? (
                  myCourses.map((course) => (
                    <Card key={course.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <div className="flex gap-2">
                          <Badge variant="secondary">{course.category}</Badge>
                          <Badge variant="outline">{course.level}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between text-sm">
                            <span>Students: {course.students}</span>
                            <span>Rating: {course.rating}</span>
                          </div>
                          <div className="text-lg font-bold text-primary">
                            ${course.price}
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => deleteCourse(course.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
                    <p className="text-muted-foreground mb-4">Create your first course to get started!</p>
                    <Button asChild>
                      <Link to="/instructor/create-course">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Course
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;