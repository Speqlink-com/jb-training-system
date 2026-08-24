"use client";

import { useAuth } from "@/lib/auth/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ElevatedCard, PrimaryCard, SuccessCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ApiStatus } from "@/components/common/api-status";
import { 
  Users, 
  GraduationCap, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight, 
  Shield, 
  Zap, 
  Globe,
  Target,
  BarChart3,
  Settings
} from "lucide-react";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground font-medium">Loading TrainSyt Platform...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Navigation Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary rounded-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">TrainSyt</h1>
                <p className="text-xs text-muted-foreground">Training Management Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ApiStatus />
              <Button 
                onClick={() => router.push('/auth/login')}
                size="lg"
                className="btn-solid-primary"
              >
                Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Badge variant="secondary" className="px-4 py-2">
                <Zap className="h-4 w-4 mr-2" />
                Enterprise Ready
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                <Shield className="h-4 w-4 mr-2" />
                Secure & Compliant
              </Badge>
            </div>
            
            <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight">
              Transform Your Training
              <br />
              Management
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Complete enterprise solution for workforce training, compliance tracking, 
              and performance management. Built for scale, security, and success.
            </p>
          </div>

          <div className="flex items-center justify-center gap-6">
            <Button 
              onClick={() => router.push('/auth/login')}
              size="lg"
              className="btn-solid-primary px-8"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              onClick={() => router.push('/setup')}
              variant="outline"
              size="lg"
              className="btn-outline-enhanced px-8"
            >
              <Globe className="mr-2 h-5 w-5" />
              Live Demo
            </Button>
          </div>
        </section>

        {/* Platform Statistics */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ElevatedCard className="hover:scale-105 transition-transform duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Agents</p>
                  <p className="text-3xl font-bold text-primary">2,481</p>
                  <p className="text-xs text-muted-foreground">Active across all branches</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 font-medium">+12%</span>
                <span className="text-muted-foreground ml-1">this month</span>
              </div>
            </div>
          </ElevatedCard>

          <ElevatedCard className="hover:scale-105 transition-transform duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Trainings</p>
                  <p className="text-3xl font-bold text-blue-600">186</p>
                  <p className="text-xs text-muted-foreground">Sessions this month</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <GraduationCap className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 font-medium">+8%</span>
                <span className="text-muted-foreground ml-1">from last month</span>
              </div>
            </div>
          </ElevatedCard>
          <ElevatedCard className="hover:scale-105 transition-transform duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Compliance Rate</p>
                  <p className="text-3xl font-bold text-green-600">94.7%</p>
                  <p className="text-xs text-muted-foreground">Training completion</p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 font-medium">+2.3%</span>
                <span className="text-muted-foreground ml-1">improvement</span>
              </div>
            </div>
          </ElevatedCard>

          <ElevatedCard className="hover:scale-105 transition-transform duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Monthly Production</p>
                  <p className="text-3xl font-bold text-purple-600">KES 182M</p>
                  <p className="text-xs text-muted-foreground">Total this month</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 font-medium">+15%</span>
                <span className="text-muted-foreground ml-1">growth</span>
              </div>
            </div>
          </ElevatedCard>
        </section>

        {/* Feature Showcase */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PrimaryCard>
            <div className="admin-card-header">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <Shield className="h-6 w-6" />
                Role-Based Access Control
              </h3>
              <p className="text-white/90">Secure, customized dashboards for every user role</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <Settings className="h-5 w-5 text-red-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Super Admin</p>
                    <p className="text-sm text-white/80">Complete system control, user management, analytics</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">HOA Dashboard</p>
                    <p className="text-sm text-white/80">Multi-branch analytics, performance oversight</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Target className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Sales Manager</p>
                    <p className="text-sm text-white/80">Team management, training oversight, targets</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <GraduationCap className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Trainer Portal</p>
                    <p className="text-sm text-white/80">Training management, attendance tracking</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="p-2 bg-orange-500/20 rounded-lg">
                    <Users className="h-5 w-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Agent View</p>
                    <p className="text-sm text-white/80">Personal progress, compliance status</p>
                  </div>
                </div>
              </div>
            </div>
          </PrimaryCard>
          <SuccessCard>
            <div className="admin-card-header">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <CheckCircle className="h-6 w-6" />
                Enterprise Ready
              </h3>
              <p className="text-white/90">Production-ready with complete backend integration</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-white" />
                  <span className="text-white font-medium">FastAPI Backend Integration</span>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-white" />
                  <span className="text-white font-medium">JWT Authentication & Sessions</span>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-white" />
                  <span className="text-white font-medium">Database & Migrations Ready</span>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-white" />
                  <span className="text-white font-medium">Role-Based Permissions</span>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-white" />
                  <span className="text-white font-medium">Responsive Design System</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-white/20">
                <Button 
                  onClick={() => router.push('/setup')}
                  variant="outline"
                  size="lg"
                  className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Globe className="mr-2 h-5 w-5" />
                  Experience Live Demo
                </Button>
              </div>
            </div>
          </SuccessCard>
        </section>
        {/* System Status */}
        <section>
          <ElevatedCard>
            <div className="admin-card-header">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <Zap className="h-6 w-6 text-primary" />
                System Status & Integration
              </h3>
              <p className="text-muted-foreground">Live system health and connectivity status</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="p-3 bg-green-500 rounded-full w-fit mx-auto mb-3">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <p className="font-semibold text-green-800">Frontend Application</p>
                  <p className="text-sm text-green-600">Next.js 14 • TypeScript</p>
                  <p className="text-xs text-green-500 font-medium">✅ Running</p>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="p-3 bg-blue-500 rounded-full w-fit mx-auto mb-3">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <p className="font-semibold text-blue-800">Authentication</p>
                  <p className="text-sm text-blue-600">JWT + Role Management</p>
                  <p className="text-xs text-blue-500 font-medium">✅ Integrated</p>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="p-3 bg-purple-500 rounded-full w-fit mx-auto mb-3">
                    <Settings className="h-6 w-6 text-white" />
                  </div>
                  <p className="font-semibold text-purple-800">Demo Mode</p>
                  <p className="text-sm text-purple-600">5 User Roles Available</p>
                  <p className="text-xs text-purple-500 font-medium">✅ Active</p>
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-primary mb-1">Ready for Deployment</p>
                    <p className="text-sm text-muted-foreground mb-3">
                      Complete training management platform with role-based access control, 
                      secure authentication, and comprehensive dashboard system for all user types.
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>• Multi-role Dashboard System</span>
                      <span>• Training & Compliance Management</span>
                      <span>• Performance Analytics</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ElevatedCard>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/50 backdrop-blur-sm mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-muted-foreground">
              © 2024 TrainSyt Platform. Enterprise Training Management System.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}