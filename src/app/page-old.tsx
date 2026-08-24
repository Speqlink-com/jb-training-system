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
      // Add a small delay to prevent immediate redirect loops
      const timeout = setTimeout(() => {
        router.push("/dashboard");
      }, 100);
      return () => clearTimeout(timeout);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation Header */}
      <header className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">TrainSyt</h1>
                <p className="text-xs text-slate-500">Training Management Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ApiStatus />
              <Button 
                onClick={() => router.push('/auth/login')}
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
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
        <section className="text-center space-y-12 py-20">
          <div className="space-y-8">
            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="px-6 py-3 bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-200 rounded-full">
                <div className="flex items-center gap-2 text-emerald-700">
                  <Zap className="h-4 w-4" />
                  <span className="text-sm font-medium">Enterprise Ready</span>
                </div>
              </div>
              <div className="px-6 py-3 bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-200 rounded-full">
                <div className="flex items-center gap-2 text-indigo-700">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm font-medium">Secure & Compliant</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-slate-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
                  Transform Your
                </span>
                <br />
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                  Training Management
                </span>
              </h1>
              
              <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
                Complete enterprise solution for workforce training, compliance tracking, 
                and performance management. Built for scale, security, and success.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6">
            <Button 
              onClick={() => router.push('/auth/login')}
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl px-10 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105"
            >
              Get Started
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
            <Button 
              onClick={() => router.push('/setup')}
              variant="outline"
              size="lg"
              className="border-2 border-slate-300 bg-white/80 hover:bg-white hover:shadow-xl px-10 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 text-slate-700"
            >
              <Globe className="mr-3 h-6 w-6" />
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
                <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-emerald-600 font-medium">+12%</span>
                <span className="text-muted-foreground ml-1">this month</span>
              </div>
            </div>
          </ElevatedCard>

          <ElevatedCard className="hover:scale-105 transition-transform duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Trainings</p>
                  <p className="text-3xl font-bold text-indigo-600">186</p>
                  <p className="text-xs text-muted-foreground">Sessions this month</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-indigo-50 to-purple-100 rounded-xl">
                  <GraduationCap className="h-8 w-8 text-indigo-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-emerald-600 font-medium">+8%</span>
                <span className="text-muted-foreground ml-1">from last month</span>
              </div>
            </div>
          </ElevatedCard>
          <ElevatedCard className="hover:scale-105 transition-transform duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Compliance Rate</p>
                  <p className="text-3xl font-bold text-emerald-600">94.7%</p>
                  <p className="text-xs text-muted-foreground">Training completion</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-emerald-50 to-teal-100 rounded-xl">
                  <CheckCircle className="h-8 w-8 text-emerald-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-emerald-600 font-medium">+2.3%</span>
                <span className="text-muted-foreground ml-1">improvement</span>
              </div>
            </div>
          </ElevatedCard>

          <ElevatedCard className="hover:scale-105 transition-transform duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Monthly Production</p>
                  <p className="text-3xl font-bold text-violet-600">KES 182M</p>
                  <p className="text-xs text-muted-foreground">Total this month</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-violet-50 to-purple-100 rounded-xl">
                  <TrendingUp className="h-8 w-8 text-violet-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-emerald-600 font-medium">+15%</span>
                <span className="text-muted-foreground ml-1">growth</span>
              </div>
            </div>
          </ElevatedCard>
        </section>

        {/* Feature Showcase */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PrimaryCard>
            <div className="p-6 border-b bg-gradient-to-r from-slate-600 to-slate-700">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <Shield className="h-6 w-6" />
                Role-Based Access Control
              </h3>
              <p className="text-white/90">Secure, customized dashboards for every user role</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="p-2 bg-orange-500/20 rounded-lg">
                    <Settings className="h-5 w-5 text-orange-400" />
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
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <Target className="h-5 w-5 text-emerald-400" />
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
                  <div className="p-2 bg-violet-500/20 rounded-lg">
                    <Users className="h-5 w-5 text-violet-400" />
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
            <div className="p-6 border-b bg-gradient-to-r from-emerald-500 to-teal-600">
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
            <div className="p-6 border-b bg-gradient-to-r from-indigo-600 to-blue-600">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <Zap className="h-6 w-6" />
                System Status & Integration
              </h3>
              <p className="text-white/90">Live system health and connectivity status</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-teal-100 rounded-xl border border-emerald-200">
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full w-fit mx-auto mb-3">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <p className="font-semibold text-emerald-800">Frontend Application</p>
                  <p className="text-sm text-emerald-600">Next.js 14 • TypeScript</p>
                  <p className="text-xs text-emerald-500 font-medium">✅ Running</p>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border border-blue-200">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full w-fit mx-auto mb-3">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <p className="font-semibold text-blue-800">Authentication</p>
                  <p className="text-sm text-blue-600">JWT + Role Management</p>
                  <p className="text-xs text-blue-500 font-medium">✅ Integrated</p>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-br from-violet-50 to-purple-100 rounded-xl border border-violet-200">
                  <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full w-fit mx-auto mb-3">
                    <Settings className="h-6 w-6 text-white" />
                  </div>
                  <p className="font-semibold text-violet-800">Demo Mode</p>
                  <p className="text-sm text-violet-600">5 User Roles Available</p>
                  <p className="text-xs text-violet-500 font-medium">✅ Active</p>
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