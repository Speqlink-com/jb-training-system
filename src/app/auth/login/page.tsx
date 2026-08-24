"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await login(email, password);
    
    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Sign In
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the Training Management Platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>
          
          <div className="mt-6 space-y-4">
            <div className="text-center">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push("/setup")}
                disabled={isLoading}
              >
                First time? Set up Super Admin
              </Button>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Demo Credentials for Presentation:
              </p>
              <div className="space-y-2 text-xs bg-muted/30 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold text-primary">Super Admin</p>
                    <p>admin@trainsyt.com</p>
                    <p>Admin123!@#</p>
                  </div>
                  <div>
                    <p className="font-semibold text-blue-600">Head of Agency</p>
                    <p>hoa@trainsyt.com</p>
                    <p>HOA123!@#</p>
                  </div>
                  <div>
                    <p className="font-semibold text-green-600">Sales Manager</p>
                    <p>manager@trainsyt.com</p>
                    <p>Manager123!@#</p>
                  </div>
                  <div>
                    <p className="font-semibold text-purple-600">Trainer</p>
                    <p>trainer@trainsyt.com</p>
                    <p>Trainer123!@#</p>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <div>
                    <p className="font-semibold text-orange-600">Agent</p>
                    <p>agent@trainsyt.com</p>
                    <p>Agent123!@#</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}