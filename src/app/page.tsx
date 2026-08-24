"use client";

import { useAuth } from "@/lib/auth/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
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
      const timeout = setTimeout(() => {
        router.push("/dashboard");
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mx-auto"></div>
          <p className="text-slate-600 font-medium">Loading TrainSyt Platform...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
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

      <main className="max-w-7xl mx-auto px-6 py-16 space-y-24">
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
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="group">
            <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-white/80">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-2">Total Agents</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-indigo-600 bg-clip-text text-transparent">2,481</p>
                  <p className="text-xs text-slate-400 mt-1">Active across all branches</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-2xl group-hover:from-indigo-200 group-hover:to-blue-200 transition-all duration-300">
                  <Users className="h-10 w-10 text-indigo-600" />
                </div>
              </div>
              <div className="flex items-center text-sm">
                <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
                  <span className="text-emerald-600 font-semibold">+12%</span>
                  <span className="text-slate-500">this month</span>
                </div>
              </div>
            </div>
          </div>

          <div className="group">
            <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-white/80">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-2">Active Trainings</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-purple-600 bg-clip-text text-transparent">186</p>
                  <p className="text-xs text-slate-400 mt-1">Sessions this month</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl group-hover:from-purple-200 group-hover:to-indigo-200 transition-all duration-300">
                  <GraduationCap className="h-10 w-10 text-purple-600" />
                </div>
              </div>
              <div className="flex items-center text-sm">
                <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
                  <span className="text-emerald-600 font-semibold">+8%</span>
                  <span className="text-slate-500">from last month</span>
                </div>
              </div>
            </div>
          </div>

          <div className="group">
            <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-white/80">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-2">Compliance Rate</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-emerald-600 bg-clip-text text-transparent">94.7%</p>
                  <p className="text-xs text-slate-400 mt-1">Training completion</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl group-hover:from-emerald-200 group-hover:to-teal-200 transition-all duration-300">
                  <CheckCircle className="h-10 w-10 text-emerald-600" />
                </div>
              </div>
              <div className="flex items-center text-sm">
                <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
                  <span className="text-emerald-600 font-semibold">+2.3%</span>
                  <span className="text-slate-500">improvement</span>
                </div>
              </div>
            </div>
          </div>

          <div className="group">
            <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-white/80">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-2">Monthly Production</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-violet-600 bg-clip-text text-transparent">KES 182M</p>
                  <p className="text-xs text-slate-400 mt-1">Total this month</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl group-hover:from-violet-200 group-hover:to-purple-200 transition-all duration-300">
                  <TrendingUp className="h-10 w-10 text-violet-600" />
                </div>
              </div>
              <div className="flex items-center text-sm">
                <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
                  <span className="text-emerald-600 font-semibold">+15%</span>
                  <span className="text-slate-500">growth</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Feature Showcase */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white/60 backdrop-blur-sm border border-white/50 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500">
            <div className="p-8 bg-gradient-to-r from-slate-700 to-slate-800">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3 mb-3">
                <Shield className="h-7 w-7" />
                Role-Based Access Control
              </h3>
              <p className="text-white/90 text-lg">Secure, customized dashboards for every user role</p>
            </div>
            <div className="p-8 space-y-4">
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100">
                  <div className="p-2 bg-gradient-to-br from-orange-400 to-amber-500 rounded-lg">
                    <Settings className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 mb-1">Super Admin</p>
                    <p className="text-sm text-slate-600">Complete system control, user management, analytics</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 mb-1">HOA Dashboard</p>
                    <p className="text-sm text-slate-600">Multi-branch analytics, performance oversight</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                  <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 mb-1">Sales Manager</p>
                    <p className="text-sm text-slate-600">Team management, training oversight, targets</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-100">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg">
                    <GraduationCap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 mb-1">Trainer Portal</p>
                    <p className="text-sm text-slate-600">Training management, attendance tracking</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-100">
                  <div className="p-2 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 mb-1">Agent View</p>
                    <p className="text-sm text-slate-600">Personal progress, compliance status</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm border border-white/50 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500">
            <div className="p-8 bg-gradient-to-r from-emerald-600 to-teal-600">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3 mb-3">
                <CheckCircle className="h-7 w-7" />
                Enterprise Ready
              </h3>
              <p className="text-white/90 text-lg">Production-ready with complete backend integration</p>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-200">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                  <span className="text-slate-700 font-medium text-lg">FastAPI Backend Integration</span>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-200">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                  <span className="text-slate-700 font-medium text-lg">JWT Authentication & Sessions</span>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-200">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                  <span className="text-slate-700 font-medium text-lg">Database & Migrations Ready</span>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-200">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                  <span className="text-slate-700 font-medium text-lg">Role-Based Permissions</span>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-200">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                  <span className="text-slate-700 font-medium text-lg">Responsive Design System</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-200">
                <Button 
                  onClick={() => router.push('/setup')}
                  variant="outline"
                  size="lg"
                  className="w-full bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 text-emerald-700 hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100 py-3 font-semibold"
                >
                  <Globe className="mr-3 h-6 w-6" />
                  Experience Live Demo
                </Button>
              </div>
            </div>
          </div>
        </section>
        {/* System Status */}
        <section>
          <div className="bg-white/60 backdrop-blur-sm border border-white/50 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-8 bg-gradient-to-r from-indigo-600 to-blue-600">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3 mb-3">
                <Zap className="h-7 w-7" />
                System Status & Integration
              </h3>
              <p className="text-white/90 text-lg">Live system health and connectivity status</p>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-100 rounded-2xl border border-emerald-200">
                  <div className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl w-fit mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <p className="font-bold text-emerald-800 text-lg mb-2">Frontend Application</p>
                  <p className="text-emerald-600 mb-1">Next.js 14 • TypeScript</p>
                  <p className="text-xs text-emerald-500 font-medium">✅ Running</p>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl border border-blue-200">
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl w-fit mx-auto mb-4">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <p className="font-bold text-blue-800 text-lg mb-2">Authentication</p>
                  <p className="text-blue-600 mb-1">JWT + Role Management</p>
                  <p className="text-xs text-blue-500 font-medium">✅ Integrated</p>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-violet-50 to-purple-100 rounded-2xl border border-violet-200">
                  <div className="p-4 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl w-fit mx-auto mb-4">
                    <Settings className="h-8 w-8 text-white" />
                  </div>
                  <p className="font-bold text-violet-800 text-lg mb-2">Demo Mode</p>
                  <p className="text-violet-600 mb-1">5 User Roles Available</p>
                  <p className="text-xs text-violet-500 font-medium">✅ Active</p>
                </div>
              </div>
              
              <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                    <Globe className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-indigo-800 mb-2 text-xl">Ready for Deployment</p>
                    <p className="text-slate-600 mb-4 leading-relaxed">
                      Complete training management platform with role-based access control, 
                      secure authentication, and comprehensive dashboard system for all user types.
                    </p>
                    <div className="flex items-center gap-6 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        Multi-role Dashboard System
                      </span>
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                        Training & Compliance Management
                      </span>
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        Performance Analytics
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/70 backdrop-blur-md mt-24">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <p className="text-slate-500 text-lg">
              © 2024 TrainSyt Platform. Enterprise Training Management System.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}