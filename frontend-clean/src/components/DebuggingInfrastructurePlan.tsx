"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Circle,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Terminal,
  Database,
  Globe,
  Shield,
  Bug,
  Zap,
  Settings,
  FileText,
  Users,
  Clock,
  TrendingUp,
  Activity,
} from "lucide-react";

export default function DebuggingInfrastructurePlan() {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const infrastructure = {
    monitoring: {
      title: "🔍 Real-Time Monitoring",
      icon: Activity,
      priority: "critical",
      status: "partial",
      components: [
        {
          name: "Application Performance Monitoring (APM)",
          description: "Track response times, error rates, and resource usage",
          tools: ["Sentry", "New Relic", "DataDog"],
          implementation:
            "Set up Sentry for error tracking and performance monitoring",
          estimatedTime: "2-3 days",
          complexity: "medium",
        },
        {
          name: "Database Query Monitoring",
          description: "Monitor Prisma query performance and slow queries",
          tools: ["Prisma Studio", "PgBouncer", "Query Analytics"],
          implementation:
            "Configure Prisma query logging and set up database monitoring",
          estimatedTime: "1-2 days",
          complexity: "low",
        },
        {
          name: "Blockchain Transaction Monitoring",
          description:
            "Track ETH transactions, gas usage, and RPC call failures",
          tools: ["Etherscan API", "Tenderly", "Custom Dashboard"],
          implementation:
            "Build transaction monitoring dashboard with retry logic",
          estimatedTime: "3-4 days",
          complexity: "high",
        },
      ],
    },
    logging: {
      title: "📝 Structured Logging System",
      icon: FileText,
      priority: "critical",
      status: "needs-improvement",
      components: [
        {
          name: "Centralized Logging",
          description: "Aggregate logs from all services in one place",
          tools: ["Winston", "Pino", "ELK Stack", "LogDNA"],
          implementation:
            "Replace console.log with structured logging using Winston",
          estimatedTime: "2-3 days",
          complexity: "medium",
        },
        {
          name: "Log Correlation",
          description: "Track requests across microservices with unique IDs",
          tools: ["UUID", "Request Tracing", "Custom Middleware"],
          implementation:
            "Implement request ID tracking across frontend and backend",
          estimatedTime: "1-2 days",
          complexity: "low",
        },
        {
          name: "Error Context Enrichment",
          description:
            "Add user context, session data, and system state to errors",
          tools: ["Sentry Context", "Custom Error Handlers"],
          implementation:
            "Enhance error reporting with user and system context",
          estimatedTime: "2 days",
          complexity: "medium",
        },
      ],
    },
    debugging: {
      title: "🐛 Debugging Toolchain",
      icon: Bug,
      priority: "high",
      status: "basic",
      components: [
        {
          name: "Advanced Debugging Interface",
          description: "In-app debugging tools for production issues",
          tools: ["React DevTools", "Redux DevTools", "Custom Debug Panel"],
          implementation:
            "Build admin debugging dashboard with system diagnostics",
          estimatedTime: "4-5 days",
          complexity: "high",
        },
        {
          name: "Database Debugging Tools",
          description: "Query analyzer, data viewer, and migration tools",
          tools: ["Prisma Studio", "Custom Admin Interface"],
          implementation: "Create comprehensive database debugging interface",
          estimatedTime: "3-4 days",
          complexity: "medium",
        },
        {
          name: "Blockchain Debugging Suite",
          description:
            "Transaction simulation, gas estimation, and RPC debugging",
          tools: ["Tenderly", "Hardhat Network", "Custom Tools"],
          implementation: "Build blockchain-specific debugging utilities",
          estimatedTime: "5-6 days",
          complexity: "high",
        },
      ],
    },
    testing: {
      title: "🧪 Testing Infrastructure",
      icon: Shield,
      priority: "high",
      status: "partial",
      components: [
        {
          name: "Comprehensive Test Suite",
          description: "Unit, integration, and E2E tests with good coverage",
          tools: ["Jest", "Playwright", "Testing Library"],
          implementation: "Achieve 80%+ test coverage across critical paths",
          estimatedTime: "1-2 weeks",
          complexity: "high",
        },
        {
          name: "Load Testing Framework",
          description: "Test system performance under realistic load",
          tools: ["Artillery", "K6", "Custom Scripts"],
          implementation: "Set up automated load testing for payment flows",
          estimatedTime: "3-4 days",
          complexity: "medium",
        },
        {
          name: "Chaos Engineering",
          description: "Test system resilience by simulating failures",
          tools: ["Gremlin", "Custom Failure Injection"],
          implementation:
            "Implement failure scenarios for blockchain and database",
          estimatedTime: "1 week",
          complexity: "high",
        },
      ],
    },
    alerts: {
      title: "🚨 Alerting System",
      icon: AlertTriangle,
      priority: "critical",
      status: "missing",
      components: [
        {
          name: "Real-Time Alerting",
          description: "Instant notifications for critical issues",
          tools: ["PagerDuty", "Slack", "Email", "SMS"],
          implementation:
            "Configure multi-channel alerting for different severity levels",
          estimatedTime: "2-3 days",
          complexity: "medium",
        },
        {
          name: "Health Check Endpoints",
          description: "Monitor system health and dependencies",
          tools: ["Custom Health Checks", "Kubernetes Probes"],
          implementation: "Implement comprehensive health check endpoints",
          estimatedTime: "2 days",
          complexity: "low",
        },
        {
          name: "Automated Incident Response",
          description: "Automated responses to common issues",
          tools: ["Custom Scripts", "Webhooks", "Automation"],
          implementation: "Build automated recovery procedures",
          estimatedTime: "3-4 days",
          complexity: "medium",
        },
      ],
    },
    documentation: {
      title: "📚 Debugging Documentation",
      icon: FileText,
      priority: "medium",
      status: "basic",
      components: [
        {
          name: "Troubleshooting Guides",
          description: "Step-by-step guides for common issues",
          tools: ["Markdown", "Wiki", "Knowledge Base"],
          implementation: "Create comprehensive troubleshooting documentation",
          estimatedTime: "1 week",
          complexity: "low",
        },
        {
          name: "Runbook Library",
          description: "Standard procedures for incident response",
          tools: ["Runbooks", "Checklists", "Flowcharts"],
          implementation: "Document standard operating procedures",
          estimatedTime: "3-4 days",
          complexity: "low",
        },
        {
          name: "Debugging Training Program",
          description: "Team training on debugging best practices",
          tools: ["Training Materials", "Workshops", "Mentoring"],
          implementation: "Create team debugging skill development program",
          estimatedTime: "2 weeks",
          complexity: "medium",
        },
      ],
    },
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "complete":
        return <CheckCircle2 className="h-4 w-4 text-green-400" />;
      case "partial":
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case "needs-improvement":
        return <AlertTriangle className="h-4 w-4 text-orange-400" />;
      case "missing":
        return <Circle className="h-4 w-4 text-red-400" />;
      case "basic":
        return <Circle className="h-4 w-4 text-gray-400" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical":
        return "text-red-400 bg-red-900/20 border-red-800";
      case "high":
        return "text-orange-400 bg-orange-900/20 border-orange-800";
      case "medium":
        return "text-yellow-400 bg-yellow-900/20 border-yellow-800";
      case "low":
        return "text-green-400 bg-green-900/20 border-green-800";
      default:
        return "text-gray-400 bg-gray-900/20 border-gray-800";
    }
  };

  const getComplexityColor = (complexity) => {
    switch (complexity) {
      case "high":
        return "text-red-300";
      case "medium":
        return "text-yellow-300";
      case "low":
        return "text-green-300";
      default:
        return "text-gray-300";
    }
  };

  const calculateTotalTime = () => {
    let totalDays = 0;
    Object.values(infrastructure).forEach((section) => {
      section.components.forEach((comp) => {
        const days = parseInt(comp.estimatedTime) || 0;
        totalDays += days;
      });
    });
    return totalDays;
  };

  const getImplementationPriority = () => {
    const allComponents = [];
    Object.entries(infrastructure).forEach(([key, section]) => {
      section.components.forEach((comp) => {
        allComponents.push({
          ...comp,
          section: key,
          sectionTitle: section.title,
          priority: section.priority,
        });
      });
    });

    return allComponents
      .filter(
        (comp) => comp.priority === "critical" || comp.priority === "high"
      )
      .sort((a, b) => {
        const priorityOrder = { critical: 3, high: 2, medium: 1, low: 0 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      })
      .slice(0, 5);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            🔧 Debugging Infrastructure Plan
          </h1>
          <p className="text-slate-300">
            Advancia Pay Ledger - Production-Ready Debugging System
          </p>
        </div>

        {/* Executive Summary */}
        <div className="mb-8 p-6 bg-white/10 backdrop-blur rounded-lg border border-white/20">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            Executive Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-4 bg-white/5 rounded">
              <div className="text-3xl font-bold text-blue-400">
                {Object.keys(infrastructure).length}
              </div>
              <div className="text-sm text-slate-300">Infrastructure Areas</div>
            </div>
            <div className="p-4 bg-white/5 rounded">
              <div className="text-3xl font-bold text-green-400">
                {calculateTotalTime()} days
              </div>
              <div className="text-sm text-slate-300">
                Estimated Implementation
              </div>
            </div>
            <div className="p-4 bg-white/5 rounded">
              <div className="text-3xl font-bold text-purple-400">6</div>
              <div className="text-sm text-slate-300">Critical Components</div>
            </div>
          </div>
        </div>

        {/* Priority Implementation Plan */}
        <div className="mb-8 p-6 bg-white/10 backdrop-blur rounded-lg border border-white/20">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Zap className="h-6 w-6" />
            Priority Implementation (First 2 Weeks)
          </h2>
          <div className="space-y-3">
            {getImplementationPriority().map((item, idx) => (
              <div
                key={idx}
                className="p-4 bg-white/5 rounded border border-white/10"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-sm text-slate-300 mb-2">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded border ${getPriorityColor(
                          item.priority
                        )}`}
                      >
                        {item.priority}
                      </span>
                      <span className="text-slate-400">
                        {item.estimatedTime}
                      </span>
                      <span className={getComplexityColor(item.complexity)}>
                        {item.complexity} complexity
                      </span>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-blue-400">
                    #{idx + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Infrastructure Sections */}
        {Object.entries(infrastructure).map(([key, section]) => {
          const Icon = section.icon;
          const isExpanded = expandedSections[key];

          return (
            <div
              key={key}
              className="mb-6 bg-white/5 backdrop-blur rounded-lg border border-white/10"
            >
              <button
                onClick={() => toggleSection(key)}
                className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-6 w-6" />
                  <div className="text-left">
                    <h2 className="text-xl font-bold">{section.title}</h2>
                    <div className="flex items-center gap-3 mt-1">
                      {getStatusIcon(section.status)}
                      <span
                        className={`px-2 py-1 rounded text-xs border ${getPriorityColor(
                          section.priority
                        )}`}
                      >
                        {section.priority}
                      </span>
                      <span className="text-sm text-slate-400">
                        {section.components.length} components
                      </span>
                    </div>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </button>

              {isExpanded && (
                <div className="px-6 pb-6">
                  <div className="space-y-4">
                    {section.components.map((component, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-white/5 rounded border border-white/10"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-lg">
                            {component.name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-slate-400">
                              {component.estimatedTime}
                            </span>
                            <span
                              className={getComplexityColor(
                                component.complexity
                              )}
                            >
                              {component.complexity}
                            </span>
                          </div>
                        </div>

                        <p className="text-slate-300 mb-3">
                          {component.description}
                        </p>

                        <div className="mb-3">
                          <div className="text-sm font-medium text-slate-400 mb-1">
                            Tools:
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {component.tools.map((tool, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-blue-900/30 text-blue-300 rounded text-sm"
                              >
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="text-sm font-medium text-slate-400 mb-1">
                            Implementation:
                          </div>
                          <p className="text-sm text-slate-300">
                            {component.implementation}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Implementation Timeline */}
        <div className="mt-8 p-6 bg-white/10 backdrop-blur rounded-lg border border-white/20">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Clock className="h-6 w-6" />
            Suggested Implementation Timeline
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-20 text-sm font-medium text-blue-400">
                Week 1-2
              </div>
              <div className="flex-1 text-sm">
                Critical monitoring and logging infrastructure
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-20 text-sm font-medium text-green-400">
                Week 3-4
              </div>
              <div className="flex-1 text-sm">
                Debugging tools and alerting system
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-20 text-sm font-medium text-purple-400">
                Week 5-6
              </div>
              <div className="flex-1 text-sm">
                Testing infrastructure and documentation
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-20 text-sm font-medium text-orange-400">
                Week 7-8
              </div>
              <div className="flex-1 text-sm">
                Advanced features and team training
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
