import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, Menu, X, User, GraduationCap } from "lucide-react";

interface NavigationProps {
  userRole?: "student" | "instructor" | null;
  onAuthClick: () => void;
}

const Navigation = ({ userRole, onAuthClick }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md z-50 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              LearnHub
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#courses" className="text-muted-foreground hover:text-foreground transition-colors">
              Courses
            </a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {userRole ? (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  {userRole === "instructor" ? (
                    <GraduationCap className="h-4 w-4 mr-2" />
                  ) : (
                    <User className="h-4 w-4 mr-2" />
                  )}
                  Dashboard
                </Button>
              </div>
            ) : (
              <>
                <Button variant="ghost" onClick={onAuthClick}>
                  Login
                </Button>
                <Button variant="default" onClick={onAuthClick}>
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <a href="#courses" className="block text-muted-foreground hover:text-foreground">
              Courses
            </a>
            <a href="#about" className="block text-muted-foreground hover:text-foreground">
              About
            </a>
            <a href="#pricing" className="block text-muted-foreground hover:text-foreground">
              Pricing
            </a>
            <div className="pt-4 space-y-2">
              {userRole ? (
                <Button variant="ghost" className="w-full justify-start">
                  {userRole === "instructor" ? (
                    <GraduationCap className="h-4 w-4 mr-2" />
                  ) : (
                    <User className="h-4 w-4 mr-2" />
                  )}
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button variant="ghost" className="w-full" onClick={onAuthClick}>
                    Login
                  </Button>
                  <Button variant="default" className="w-full" onClick={onAuthClick}>
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;