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
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex items-center space-x-2.5 sm:space-x-3">
              <div className="rounded-xl bg-button-gradient p-2 shadow-lg">
                <GraduationCap className="h-5 w-5 text-white sm:h-6 sm:w-6" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-950 sm:text-xl">Jubilee Learning Hub</h1>
                <p className="hidden text-xs text-slate-500 sm:block">Training Management Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:block"><ApiStatus /></div>
              <Button 
                onClick={() => router.push('/auth/login')}
                size="sm"
                className="bg-button-gradient px-3 text-white shadow-lg sm:h-10 sm:px-5"
              >
                Sign In
                <ArrowRight className="hidden h-4 w-4 sm:block" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-14 px-4 py-10 sm:space-y-20 sm:px-6 sm:py-14 lg:space-y-24 lg:py-16">
        {/* Hero Section */}
        <section className="space-y-7 py-4 text-center sm:space-y-10 sm:py-12">
          <div className="space-y-6 sm:space-y-8">
            <div className="mb-5 flex flex-wrap items-center justify-center gap-2 sm:mb-8 sm:gap-4">
              <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 sm:px-5 sm:py-2.5">
                <div className="flex items-center gap-2 text-emerald-700">
                  <Zap className="h-4 w-4" />
                  <span className="text-xs font-medium sm:text-sm">Enterprise Ready</span>
                </div>
              </div>
              <div className="rounded-full border border-rose-200 bg-rose-50 px-3 py-2 sm:px-5 sm:py-2.5">
                <div className="flex items-center gap-2 text-[#9b1b36]">
                  <Shield className="h-4 w-4" />
                  <span className="text-xs font-medium sm:text-sm">Secure & Compliant</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
                <span className="text-slate-950">
                  Transform Your
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#8f1933] to-[#c8465d] bg-clip-text text-transparent">
                  Training Management
                </span>
              </h1>
              
              <p className="mx-auto max-w-3xl text-base leading-relaxed text-slate-600 sm:text-xl">
                Complete enterprise solution for workforce training, compliance tracking, 
                and performance management. Built for scale, security, and success.
              </p>
            </div>
          </div>

          <div className="mx-auto flex max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-4">
            <Button 
              onClick={() => router.push('/auth/login')}
              size="lg"
              className="h-12 w-full bg-button-gradient text-base text-white shadow-xl sm:w-auto sm:px-8 sm:text-lg"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              onClick={() => router.push('/setup')}
              variant="outline"
              size="lg"
              className="h-12 w-full border-slate-300 bg-white px-6 text-base text-slate-900 sm:w-auto sm:px-8 sm:text-lg"
            >
              <Globe className="mr-2 h-5 w-5" />
              Live Demo
            </Button>
          </div>
        </section>
        {/* Platform Statistics */}
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          <div className="group">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-2">Total Agents</p>
                  <p className="text-3xl font-bold text-slate-950 sm:text-4xl">2,481</p>
                  <p className="text-xs text-slate-400 mt-1">Active across all branches</p>
                </div>
                <div className="rounded-xl bg-slate-100 p-3">
                  <Users className="h-7 w-7 text-slate-700 sm:h-8 sm:w-8" />
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
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-2">Active Trainings</p>
                  <p className="text-3xl font-bold text-slate-950 sm:text-4xl">186</p>
                  <p className="text-xs text-slate-400 mt-1">Sessions this month</p>
                </div>
                <div className="rounded-xl bg-rose-50 p-3">
                  <GraduationCap className="h-7 w-7 text-[#9b1b36] sm:h-8 sm:w-8" />
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
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-2">Compliance Rate</p>
                  <p className="text-3xl font-bold text-slate-950 sm:text-4xl">94.7%</p>
                  <p className="text-xs text-slate-400 mt-1">Training completion</p>
                </div>
                <div className="rounded-xl bg-emerald-50 p-3">
                  <CheckCircle className="h-7 w-7 text-emerald-600 sm:h-8 sm:w-8" />
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
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-2">Monthly Production</p>
                  <p className="text-3xl font-bold text-slate-950 sm:text-4xl">KES 182M</p>
                  <p className="text-xs text-slate-400 mt-1">Total this month</p>
                </div>
                <div className="rounded-xl bg-slate-100 p-3">
                  <TrendingUp className="h-7 w-7 text-slate-700 sm:h-8 sm:w-8" />
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
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-8">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-slate-800 p-5 sm:p-7">
              <h3 className="mb-2 flex items-center gap-2 text-lg font-bold text-white sm:text-2xl">
                <Shield className="h-5 w-5 sm:h-7 sm:w-7" />
                Role-Based Access Control
              </h3>
              <p className="text-sm text-white/80 sm:text-lg">Secure, customized dashboards for every user role</p>
            </div>
            <div className="p-4 sm:p-6"><div className="space-y-3 sm:space-y-4">
                <div className="flex items-start gap-3 rounded-xl border border-orange-100 bg-orange-50 p-3 sm:gap-4 sm:p-4">
                  <div className="p-2 bg-gradient-to-br from-orange-400 to-amber-500 rounded-lg">
                    <Settings className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 mb-1">Super Admin</p>
                    <p className="text-sm text-slate-600">Complete system control, user management, analytics</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-3 sm:gap-4 sm:p-4">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 mb-1">HOA Dashboard</p>
                    <p className="text-sm text-slate-600">Multi-branch analytics, performance oversight</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-3 sm:gap-4 sm:p-4">
                  <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 mb-1">Sales Manager</p>
                    <p className="text-sm text-slate-600">Team management, training oversight, targets</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-purple-100 bg-purple-50 p-3 sm:gap-4 sm:p-4">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg">
                    <GraduationCap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 mb-1">Trainer Portal</p>
                    <p className="text-sm text-slate-600">Training management, attendance tracking</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-indigo-100 bg-indigo-50 p-3 sm:gap-4 sm:p-4">
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
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-gradient-to-r from-emerald-700 to-teal-700 p-5 sm:p-7">
              <h3 className="mb-2 flex items-center gap-2 text-lg font-bold text-white sm:text-2xl">
                <CheckCircle className="h-5 w-5 sm:h-7 sm:w-7" />
                Enterprise Ready
              </h3>
              <p className="text-sm text-white/80 sm:text-lg">Production-ready with complete backend integration</p>
            </div>
            <div className="space-y-5 p-4 sm:p-6"><div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:gap-4 sm:p-4">
                  <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600" />
                  <span className="text-sm font-medium text-slate-900 sm:text-lg">FastAPI Backend Integration</span>
                </div>
                
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:gap-4 sm:p-4">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                  <span className="text-slate-700 font-medium text-lg">JWT Authentication & Sessions</span>
                </div>
                
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:gap-4 sm:p-4">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                  <span className="text-slate-700 font-medium text-lg">Database & Migrations Ready</span>
                </div>
                
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:gap-4 sm:p-4">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                  <span className="text-slate-700 font-medium text-lg">Role-Based Permissions</span>
                </div>
                
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:gap-4 sm:p-4">
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
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-5 sm:p-7">
              <h3 className="mb-2 flex items-center gap-2 text-lg font-bold text-white sm:text-2xl">
                <Zap className="h-5 w-5 sm:h-7 sm:w-7" />
                System Status & Integration
              </h3>
              <p className="text-sm text-white/80 sm:text-lg">Live system health and connectivity status</p>
            </div>
            <div className="p-4 sm:p-6">
              <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4 sm:mb-6">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center sm:p-5">
                  <div className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl w-fit mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <p className="font-bold text-emerald-800 text-lg mb-2">Frontend Application</p>
                  <p className="text-emerald-600 mb-1">Next.js 14 • TypeScript</p>
                  <p className="text-xs text-emerald-500 font-medium">✅ Running</p>
                </div>
                
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-center sm:p-5">
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl w-fit mx-auto mb-4">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <p className="font-bold text-blue-800 text-lg mb-2">Authentication</p>
                  <p className="text-blue-600 mb-1">JWT + Role Management</p>
                  <p className="text-xs text-blue-500 font-medium">✅ Integrated</p>
                </div>
                
                <div className="rounded-xl border border-violet-200 bg-violet-50 p-4 text-center sm:p-5">
                  <div className="p-4 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl w-fit mx-auto mb-4">
                    <Settings className="h-8 w-8 text-white" />
                  </div>
                  <p className="font-bold text-violet-800 text-lg mb-2">Demo Mode</p>
                  <p className="text-violet-600 mb-1">5 User Roles Available</p>
                  <p className="text-xs text-violet-500 font-medium">✅ Active</p>
                </div>
              </div>
              
              <div className="rounded-xl border border-rose-100 bg-rose-50 p-4 sm:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                    <Globe className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="mb-2 text-lg font-bold text-slate-950 sm:text-xl">Ready for Deployment</p>
                    <p className="mb-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                      Complete training management platform with role-based access control, 
                      secure authentication, and comprehensive dashboard system for all user types.
                    </p>
                    <div className="flex flex-col gap-2 text-xs text-slate-600 sm:flex-row sm:items-center sm:gap-4 sm:text-sm">
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
      <footer className="mt-14 border-t bg-white/70 backdrop-blur-md sm:mt-20">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
          <div className="text-center">
            <p className="text-sm text-slate-500 sm:text-lg">
              © 2024 TrainSyt Platform. Enterprise Training Management System.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
