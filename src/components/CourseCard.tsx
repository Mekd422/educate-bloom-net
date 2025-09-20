import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Star, Play } from "lucide-react";

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
    instructor: string;
    thumbnail: string;
    price: number;
    duration: string;
    students: number;
    rating: number;
    level: "Beginner" | "Intermediate" | "Advanced";
    category: string;
  };
  onEnroll: (courseId: string) => void;
}

const CourseCard = ({ course, onEnroll }: CourseCardProps) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-success/10 text-success";
      case "Intermediate":
        return "bg-primary/10 text-primary";
      case "Advanced":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-0">
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
          <Play className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <Badge className={`absolute top-3 left-3 ${getLevelColor(course.level)}`}>
          {course.level}
        </Badge>
        <Badge variant="secondary" className="absolute top-3 right-3">
          {course.category}
        </Badge>
      </div>

      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {course.description}
        </p>
        <p className="text-sm font-medium text-primary mb-4">
          by {course.instructor}
        </p>

        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{course.students}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{course.rating}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex items-center justify-between">
        <div className="text-2xl font-bold text-primary">
          ${course.price}
        </div>
        <Button 
          onClick={() => onEnroll(course.id)}
          className="bg-gradient-primary hover:opacity-90 transition-opacity"
        >
          Enroll Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;