import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BookOpen, Menu, X, User, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

interface NavigationProps {
  onAuthClick: () => void;
}

const Navigation = ({ onAuthClick }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut, loading } = useAuth();

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
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Courses
            </Link>
            {user && (
              <Link 
                to={user.role === 'instructor' ? '/instructor/dashboard' : '/student/dashboard'} 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
            )}
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {!loading && (
              user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem className="flex flex-col items-start">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                      <div className="text-xs text-muted-foreground capitalize">{user.role}</div>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link 
                        to={user.role === 'instructor' ? '/instructor/dashboard' : '/student/dashboard'}
                        className="w-full"
                      >
                        <User className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="ghost" onClick={onAuthClick}>
                    Login
                  </Button>
                  <Button variant="default" onClick={onAuthClick}>
                    Sign Up
                  </Button>
                </>
              )
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
            <Link to="/" className="block text-muted-foreground hover:text-foreground">
              Courses
            </Link>
            {user && (
              <Link 
                to={user.role === 'instructor' ? '/instructor/dashboard' : '/student/dashboard'} 
                className="block text-muted-foreground hover:text-foreground"
              >
                Dashboard
              </Link>
            )}
            <a href="#about" className="block text-muted-foreground hover:text-foreground">
              About
            </a>
            <div className="pt-4 space-y-2">
              {user ? (
                <Button variant="ghost" className="w-full justify-start" onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
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