import { useAuth } from "@/hooks/useAuth";
import { useEnrollments } from "@/hooks/useEnrollments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Users, Award, TrendingUp } from "lucide-react";
import Navigation from "@/components/Navigation";

const StudentDashboard = () => {
  const { user } = useAuth();
  const { enrollments, loading } = useEnrollments();

  if (!user || user.role !== 'student') {
    return <div>Access denied</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation onAuthClick={() => {}} />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {user.name}</h1>
              <p className="text-muted-foreground">Continue your learning journey</p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">{enrollments.length}</p>
                      <p className="text-sm text-muted-foreground">Enrolled Courses</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">
                        {enrollments.reduce((acc, enrollment) => acc + enrollment.progress, 0) / enrollments.length || 0}%
                      </p>
                      <p className="text-sm text-muted-foreground">Avg Progress</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">{enrollments.filter(e => e.progress === 100).length}</p>
                      <p className="text-sm text-muted-foreground">Completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">{enrollments.length}</p>
                      <p className="text-sm text-muted-foreground">Active Courses</p>
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
                ) : (
                  enrollments.map((enrollment) => (
                    <Card key={enrollment.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{enrollment.course.title}</CardTitle>
                        <Badge variant="secondary">{enrollment.course.category}</Badge>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span>Progress</span>
                              <span>{enrollment.progress}%</span>
                            </div>
                            <Progress value={enrollment.progress} />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Instructor: {enrollment.course.instructor?.name}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;