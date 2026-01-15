"use client";

import React, { useState } from "react";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function DebuggingSelfAudit() {
  const [responses, setResponses] = useState({});

  const categories = {
    preparation: {
      title: "🎯 Preparation & Prevention",
      questions: [
        {
          id: "p1",
          text: "Do you write tests before/during development?",
          weight: 3,
        },
        {
          id: "p2",
          text: "Do you use TypeScript strict mode effectively?",
          weight: 2,
        },
        {
          id: "p3",
          text: "Do you have proper logging in place before bugs occur?",
          weight: 2,
        },
        {
          id: "p4",
          text: "Do you use linters and code quality tools?",
          weight: 1,
        },
      ],
    },
    identification: {
      title: "🔍 Bug Identification",
      questions: [
        {
          id: "i1",
          text: "Can you consistently reproduce bugs before fixing?",
          weight: 3,
        },
        {
          id: "i2",
          text: "Do you check error logs/stack traces first?",
          weight: 2,
        },
        {
          id: "i3",
          text: "Do you isolate the problem before diving into code?",
          weight: 2,
        },
        {
          id: "i4",
          text: "Do you verify assumptions with data/tests?",
          weight: 2,
        },
      ],
    },
    tooling: {
      title: "🛠️ Tools & Techniques",
      questions: [
        {
          id: "t1",
          text: "Do you use a debugger (not just console.log)?",
          weight: 3,
        },
        {
          id: "t2",
          text: "Do you use browser DevTools effectively?",
          weight: 2,
        },
        {
          id: "t3",
          text: "Do you use database query analyzers for Prisma issues?",
          weight: 2,
        },
        {
          id: "t4",
          text: "Do you leverage AI/documentation before trial-and-error?",
          weight: 1,
        },
      ],
    },
    process: {
      title: "⚡ Process & Speed",
      questions: [
        {
          id: "pr1",
          text: "Do you follow a systematic debugging process?",
          weight: 3,
        },
        {
          id: "pr2",
          text: "Do you avoid rabbit holes (set time limits)?",
          weight: 2,
        },
        {
          id: "pr3",
          text: "Do you document fixes for future reference?",
          weight: 2,
        },
        {
          id: "pr4",
          text: "Do you test fixes in multiple scenarios?",
          weight: 2,
        },
      ],
    },
    blockchain: {
      title: "⛓️ Blockchain-Specific (Your Stack)",
      questions: [
        {
          id: "b1",
          text: "Do you test with testnet before mainnet deployments?",
          weight: 3,
        },
        {
          id: "b2",
          text: "Do you verify transaction status/receipts properly?",
          weight: 2,
        },
        {
          id: "b3",
          text: "Do you handle gas estimation errors gracefully?",
          weight: 2,
        },
        {
          id: "b4",
          text: "Do you have fallback strategies for RPC failures?",
          weight: 2,
        },
      ],
    },
  };

  const handleResponse = (questionId, value) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  const calculateScore = () => {
    let totalWeight = 0;
    let earnedPoints = 0;

    Object.values(categories).forEach((category) => {
      category.questions.forEach((q) => {
        totalWeight += q.weight * 3;
        const response = responses[q.id];
        if (response === "always") earnedPoints += q.weight * 3;
        else if (response === "sometimes") earnedPoints += q.weight * 1.5;
        else if (response === "rarely") earnedPoints += q.weight * 0.5;
      });
    });

    return totalWeight > 0 ? Math.round((earnedPoints / totalWeight) * 100) : 0;
  };

  const getCategoryScore = (category) => {
    let totalWeight = 0;
    let earnedPoints = 0;

    category.questions.forEach((q) => {
      totalWeight += q.weight * 3;
      const response = responses[q.id];
      if (response === "always") earnedPoints += q.weight * 3;
      else if (response === "sometimes") earnedPoints += q.weight * 1.5;
      else if (response === "rarely") earnedPoints += q.weight * 0.5;
    });

    return totalWeight > 0 ? Math.round((earnedPoints / totalWeight) * 100) : 0;
  };

  const getRecommendations = () => {
    const weakCategories = Object.entries(categories)
      .map(([key, cat]) => ({ key, ...cat, score: getCategoryScore(cat) }))
      .filter((cat) => cat.score < 60)
      .sort((a, b) => a.score - b.score);

    const recommendations = {
      preparation: [
        "Set up Jest/Vitest with good coverage before production",
        "Enable strict TypeScript config in tsconfig.json",
        "Implement structured logging (Winston/Pino) across services",
      ],
      identification: [
        "Create a bug repro template in your workflow",
        "Set up Sentry or similar error tracking",
        "Use Git bisect to identify when bugs were introduced",
      ],
      tooling: [
        "Learn VS Code debugger for Node.js/TypeScript",
        "Master Chrome DevTools Network & Performance tabs",
        "Use Prisma Studio for database debugging",
      ],
      process: [
        "Document your debugging checklist",
        "Use Pomodoro (25min) for debugging sessions",
        "Create a 'bugs.md' in your repo with solutions",
      ],
      blockchain: [
        "Always test on Sepolia/Mumbai before mainnet",
        "Implement retry logic for RPC calls",
        "Use Tenderly for transaction simulation",
      ],
    };

    return weakCategories.slice(0, 2).map((cat) => ({
      category: cat.title,
      score: cat.score,
      tips: recommendations[cat.key] || [],
    }));
  };

  const score = calculateScore();
  const allAnswered =
    Object.keys(responses).length ===
    Object.values(categories).reduce(
      (sum, cat) => sum + cat.questions.length,
      0
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">🐛 Debugging Self-Audit</h1>
          <p className="text-slate-300">
            Advancia Pay Ledger Developer Edition
          </p>
        </div>

        {allAnswered && (
          <div className="mb-8 p-6 bg-white/10 backdrop-blur rounded-lg border border-white/20">
            <div className="text-center mb-4">
              <div className="text-5xl font-bold mb-2">{score}%</div>
              <div className="text-xl">
                {score >= 80
                  ? "🏆 Elite Debugger"
                  : score >= 60
                  ? "💪 Strong Debugger"
                  : score >= 40
                  ? "📈 Room to Grow"
                  : "🎯 Optimization Needed"}
              </div>
            </div>

            {getRecommendations().length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">
                  🎯 Top Priority Improvements:
                </h3>
                {getRecommendations().map((rec, idx) => (
                  <div key={idx} className="mb-4 p-4 bg-white/5 rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{rec.category}</span>
                      <span className="text-sm text-slate-400">
                        ({rec.score}%)
                      </span>
                    </div>
                    <ul className="text-sm space-y-1 text-slate-300">
                      {rec.tips.map((tip, i) => (
                        <li key={i}>• {tip}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {Object.entries(categories).map(([key, category]) => {
          const catScore = getCategoryScore(category);
          const allCatAnswered = category.questions.every(
            (q) => responses[q.id]
          );

          return (
            <div
              key={key}
              className="mb-6 p-6 bg-white/5 backdrop-blur rounded-lg border border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">{category.title}</h2>
                {allCatAnswered && (
                  <div className="text-lg font-bold px-3 py-1 bg-white/10 rounded">
                    {catScore}%
                  </div>
                )}
              </div>

              {category.questions.map((q) => (
                <div
                  key={q.id}
                  className="mb-4 pb-4 border-b border-white/10 last:border-0"
                >
                  <div className="mb-2 text-slate-200">{q.text}</div>
                  <div className="flex gap-3">
                    {[
                      {
                        value: "always",
                        label: "Always",
                        icon: CheckCircle,
                        color: "bg-green-600",
                      },
                      {
                        value: "sometimes",
                        label: "Sometimes",
                        icon: AlertCircle,
                        color: "bg-yellow-600",
                      },
                      {
                        value: "rarely",
                        label: "Rarely",
                        icon: XCircle,
                        color: "bg-red-600",
                      },
                    ].map((option) => {
                      const Icon = option.icon;
                      const isSelected = responses[q.id] === option.value;

                      return (
                        <button
                          key={option.value}
                          onClick={() => handleResponse(q.id, option.value)}
                          className={`flex-1 py-2 px-3 rounded transition-all ${
                            isSelected
                              ? `${option.color} scale-105 shadow-lg`
                              : "bg-white/10 hover:bg-white/20"
                          }`}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <Icon size={16} />
                            <span className="text-sm">{option.label}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          );
        })}

        <div className="mt-8 p-4 bg-white/5 rounded text-sm text-slate-300 text-center">
          Be honest with yourself - this is for your growth, not for show. 🚀
        </div>
      </div>
    </div>
  );
}
