"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_0%_0%,#f5e5e9,transparent_34rem),linear-gradient(135deg,#f7f8fa,#eef1f5)] p-4 sm:p-8">
      <Card className="w-full max-w-md overflow-hidden border-slate-200/90 bg-white shadow-xl shadow-slate-900/10">
        <div className="h-1.5 bg-button-gradient" />
        <CardHeader className="space-y-2 px-7 pb-6 pt-8">
          <div className="mb-2 flex items-center justify-center gap-2 text-[#9b1b36]"><ShieldCheck className="h-5 w-5" /><span className="text-sm font-semibold tracking-tight">Jubilee Learning Hub</span></div>
          <CardTitle className="text-center text-2xl font-semibold tracking-tight text-slate-900">
            Welcome back
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to securely manage your training and workforce activity.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-7 pb-7">
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
                className="h-11 border-slate-200 bg-slate-50/60 focus:bg-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-11 border-slate-200 bg-slate-50/60 pr-11 focus:bg-white"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((visible) => !visible)}
                  disabled={isLoading}
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-500 transition-colors hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="h-11 w-full"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>
          
          <div className="mt-6">
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
