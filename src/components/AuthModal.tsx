import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState("login");

  if (!isOpen) return null;

  const handleSupabaseInfo = () => {
    // This will be replaced with actual Supabase authentication
    console.log("Supabase integration needed for authentication");
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md relative">
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-2 top-2 z-10"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <CardHeader className="text-center">
          <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
            Welcome to LearnHub
          </CardTitle>
          <CardDescription>
            Sign in to access courses and track your progress
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="mb-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">⚡ Backend Required</span>
              <Badge variant="secondary" className="text-xs">Supabase</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Connect to Supabase to enable user authentication, course enrollment, and progress tracking.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  disabled
                />
              </div>
              <Button 
                className="w-full bg-gradient-primary" 
                disabled
                onClick={handleSupabaseInfo}
              >
                Sign In (Requires Supabase)
              </Button>
            </TabsContent>

            <TabsContent value="register" className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-signup">Email</Label>
                <Input
                  id="email-signup"
                  type="email"
                  placeholder="Enter your email"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-signup">Password</Label>
                <Input
                  id="password-signup"
                  type="password"
                  placeholder="Create a password"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label>I want to join as:</Label>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    Student
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    Instructor
                  </Button>
                </div>
              </div>
              <Button 
                className="w-full bg-gradient-primary" 
                disabled
                onClick={handleSupabaseInfo}
              >
                Create Account (Requires Supabase)
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthModal;