"use client";
import Link from "next/link";
import {
  Shield,
  Mail,
  Bug,
  Settings,
  CreditCard,
  FileText,
  Zap,
  Users,
  TrendingUp,
  Code,
} from "lucide-react";

export default function AdminPage() {
  const adminSections = [
    {
      href: "/admin/email",
      title: "Email Service",
      description: "Manage email templates and delivery",
      icon: Mail,
      color: "from-blue-600 to-cyan-600",
    },
    {
      href: "/admin/debugging-audit",
      title: "Debugging Audit",
      description: "Developer self-assessment tool",
      icon: Bug,
      color: "from-purple-600 to-pink-600",
    },
    {
      href: "/admin/debugging-infrastructure",
      title: "Debugging Infrastructure",
      description: "Production debugging system plan",
      icon: TrendingUp,
      color: "from-cyan-600 to-blue-600",
    },
    {
      href: "/admin/debugging-implementation",
      title: "Debugging Implementation",
      description: "Step-by-step implementation guide",
      icon: Code,
      color: "from-green-600 to-teal-600",
    },
    {
      href: "/admin/cards",
      title: "Card Management",
      description: "Manage payment cards and methods",
      icon: CreditCard,
      color: "from-green-600 to-emerald-600",
    },
    {
      href: "/admin/approvals",
      title: "Approval System",
      description: "Review and approve requests",
      icon: Settings,
      color: "from-orange-600 to-red-600",
    },
    {
      href: "/admin/content-library",
      title: "Content Library",
      description: "Manage content and templates",
      icon: FileText,
      color: "from-indigo-600 to-purple-600",
    },
    {
      href: "/admin/animations",
      title: "Animations",
      description: "Configure UI animations",
      icon: Zap,
      color: "from-yellow-600 to-orange-600",
    },
    {
      href: "/admin/super",
      title: "Super Admin",
      description: "Advanced system controls",
      icon: Users,
      color: "from-red-600 to-pink-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-red-400" />
            <h1 className="text-4xl font-bold">Admin Panel</h1>
          </div>
          <p className="text-slate-300 text-lg">
            Advancia Pay Ledger Management
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section) => {
            const Icon = section.icon;
            return (
              <Link
                key={section.href}
                href={section.href}
                className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/10"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-20 group-hover:opacity-30 transition-opacity`}
                />

                <div className="relative p-8">
                  <div
                    className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${section.color} mb-4`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>

                  <h3 className="text-xl font-bold mb-2">{section.title}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {section.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                    <span>Access</span>
                    <div className="w-4 h-4 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white transform translate-x-0.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 p-6 bg-white/5 backdrop-blur rounded-xl border border-white/10">
          <h2 className="text-lg font-semibold mb-3">🔐 Security Notice</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            This admin panel provides access to sensitive system functions. All
            actions are logged and monitored. Ensure you have proper
            authorization before accessing any administrative features.
          </p>
        </div>
      </div>
    </div>
  );
}
