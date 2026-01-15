"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Network,
  Braces,
  Activity,
  BookOpen,
  Zap,
} from "lucide-react";

export default function TemporalBridgePage() {
  const [activeNode, setActiveNode] = useState(null);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [selectedBridge, setSelectedBridge] = useState("ledger");

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase((prev) => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const bridges = {
    medicine: {
      title: "Ancient Medicine → Digital Health Oracle",
      ancient: {
        name: "Traditional Medicine",
        techniques: [
          "Meridian Energy Flow",
          "Pulse Diagnosis",
          "Herbal Formulations",
          "Acupuncture Points",
        ],
        icon: Activity,
        color: "#10b981",
      },
      future: {
        name: "AI Health Prediction",
        techniques: [
          "Neural Network Analysis",
          "Biometric Blockchain",
          "Predictive Diagnostics",
          "Quantum Biomarkers",
        ],
        icon: Zap,
        color: "#06b6d4",
      },
      bridge:
        "Pattern recognition across millennia - ancient observations meet machine learning",
    },
    ledger: {
      title: "Clay Tablets → Distributed Ledgers",
      ancient: {
        name: "Mesopotamian Records",
        techniques: [
          "Cuneiform Accounting",
          "Trade Documentation",
          "Asset Registration",
          "Witness Verification",
        ],
        icon: BookOpen,
        color: "#f59e0b",
      },
      future: {
        name: "Blockchain Systems",
        techniques: [
          "Immutable Records",
          "Smart Contracts",
          "Decentralized Trust",
          "Cryptographic Proof",
        ],
        icon: Braces,
        color: "#8b5cf6",
      },
      bridge:
        "From clay to chain - the eternal quest for trustless record-keeping",
    },
    network: {
      title: "Silk Road → Neural Networks",
      ancient: {
        name: "Trade Routes",
        techniques: [
          "Hub-Spoke Networks",
          "Information Flow",
          "Cultural Exchange",
          "Trust Protocols",
        ],
        icon: Network,
        color: "#ec4899",
      },
      future: {
        name: "AI Neural Architecture",
        techniques: [
          "Layer Connections",
          "Data Propagation",
          "Weighted Pathways",
          "Emergent Intelligence",
        ],
        icon: Sparkles,
        color: "#3b82f6",
      },
      bridge:
        "Connected nodes, flowing information - structures that span civilizations",
    },
  };

  const currentBridge = bridges[selectedBridge];
  const AncientIcon = currentBridge.ancient.icon;
  const FutureIcon = currentBridge.future.icon;

  const getConnectionPath = (startX, startY, endX, endY, phase) => {
    const midX = (startX + endX) / 2;
    const amplitude = 60 * Math.sin((phase * Math.PI) / 180);
    return `M ${startX} ${startY} Q ${midX} ${
      startY + amplitude
    } ${endX} ${endY}`;
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-slate-900/90 backdrop-blur-sm border-b border-slate-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-purple-600 to-cyan-600 p-2 rounded-lg">
                <Braces className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">Advancia Pay Ledger</span>
            </div>

            <div className="flex items-center space-x-6">
              <a
                href="/"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Home
              </a>
              <a
                href="/investors"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Investors
              </a>
              <a
                href="/data-structure"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Data Structure
              </a>
              <a
                href="/login"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-lg hover:from-purple-700 hover:to-cyan-700 transition-all"
              >
                Login
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-20">
        <div className="max-w-7xl mx-auto p-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Temporal Bridge
            </h1>
            <p className="text-slate-400 text-lg">
              Where Ancient Wisdom Meets Future Technology
            </p>
          </div>

          {/* Bridge Selector */}
          <div className="flex gap-4 justify-center mb-12">
            {Object.entries(bridges).map(([key, bridge]) => (
              <button
                key={key}
                onClick={() => setSelectedBridge(key)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedBridge === key
                    ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/50"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
              >
                {bridge.title.split("→")[0]}
              </button>
            ))}
          </div>

          {/* Main Visualization */}
          <div className="relative bg-slate-900/50 backdrop-blur rounded-2xl p-12 border border-slate-800">
            <div className="grid grid-cols-3 gap-8 items-start">
              {/* Ancient Side */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: currentBridge.ancient.color + "20",
                    }}
                  >
                    <AncientIcon
                      className="w-6 h-6"
                      style={{ color: currentBridge.ancient.color }}
                    />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider">
                      Ancient
                    </div>
                    <h3 className="text-xl font-bold">
                      {currentBridge.ancient.name}
                    </h3>
                  </div>
                </div>

                <div className="space-y-3">
                  {currentBridge.ancient.techniques.map((tech, i) => (
                    <div
                      key={i}
                      className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer"
                      onMouseEnter={() => setActiveNode(`ancient-${i}`)}
                      onMouseLeave={() => setActiveNode(null)}
                      style={{
                        transform:
                          activeNode === `ancient-${i}`
                            ? "translateX(8px)"
                            : "none",
                        borderColor:
                          activeNode === `ancient-${i}`
                            ? currentBridge.ancient.color
                            : undefined,
                      }}
                    >
                      <div className="text-sm font-medium">{tech}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bridge Visualization */}
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="relative w-full h-48">
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    {/* Animated connection lines */}
                    {[0, 1, 2, 3].map((i) => (
                      <path
                        key={i}
                        d={getConnectionPath(
                          20,
                          50 + i * 30,
                          180,
                          50 + i * 30,
                          animationPhase + i * 90
                        )}
                        fill="none"
                        stroke={`url(#gradient-${i})`}
                        strokeWidth="2"
                        opacity="0.6"
                      />
                    ))}

                    {/* Gradient definitions */}
                    <defs>
                      {[0, 1, 2, 3].map((i) => (
                        <linearGradient
                          key={i}
                          id={`gradient-${i}`}
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop
                            offset="0%"
                            stopColor={currentBridge.ancient.color}
                          />
                          <stop offset="50%" stopColor="#8b5cf6" />
                          <stop
                            offset="100%"
                            stopColor={currentBridge.future.color}
                          />
                        </linearGradient>
                      ))}
                    </defs>

                    {/* Flowing particles */}
                    {[0, 1, 2].map((i) => {
                      const offset = ((animationPhase + i * 120) % 360) / 360;
                      return (
                        <circle
                          key={i}
                          cx={20 + 160 * offset}
                          cy={100 + 30 * Math.sin(offset * Math.PI * 2)}
                          r="3"
                          fill="white"
                          opacity={Math.sin(offset * Math.PI)}
                        />
                      );
                    })}
                  </svg>
                </div>

                <div className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-cyan-500/20">
                  <p className="text-center text-sm text-slate-300 italic">
                    {currentBridge.bridge}
                  </p>
                </div>
              </div>

              {/* Future Side */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6 justify-end">
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider text-right">
                      Future
                    </div>
                    <h3 className="text-xl font-bold text-right">
                      {currentBridge.future.name}
                    </h3>
                  </div>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: currentBridge.future.color + "20",
                    }}
                  >
                    <FutureIcon
                      className="w-6 h-6"
                      style={{ color: currentBridge.future.color }}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  {currentBridge.future.techniques.map((tech, i) => (
                    <div
                      key={i}
                      className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer text-right"
                      onMouseEnter={() => setActiveNode(`future-${i}`)}
                      onMouseLeave={() => setActiveNode(null)}
                      style={{
                        transform:
                          activeNode === `future-${i}`
                            ? "translateX(-8px)"
                            : "none",
                        borderColor:
                          activeNode === `future-${i}`
                            ? currentBridge.future.color
                            : undefined,
                      }}
                    >
                      <div className="text-sm font-medium">{tech}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Insight */}
          <div className="mt-8 text-center">
            <p className="text-slate-400 text-sm">
              The patterns that guided civilizations 5,000 years ago still echo
              in our neural networks today.
              <br />
              <span className="text-cyan-400">
                Hover over techniques to explore the connections.
              </span>
            </p>
          </div>

          {/* Integration Section */}
          <div className="mt-16 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-2xl p-8 border border-purple-500/30">
            <h3 className="text-2xl font-bold text-white mb-4 text-center">
              Bridging Millennia in Financial Technology
            </h3>
            <p className="text-slate-300 mb-6 text-center max-w-3xl mx-auto">
              Advancia Pay Ledger embodies this temporal bridge - bringing
              ancient principles of trust, verification, and record-keeping into
              the age of blockchain and artificial intelligence.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-slate-800/50 rounded-lg p-6 text-center">
                <BookOpen className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                <h4 className="font-semibold text-white mb-2">Ancient Trust</h4>
                <p className="text-slate-400 text-sm">
                  From clay tablets to distributed ledgers, the quest for
                  immutable records continues
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-6 text-center">
                <Braces className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <h4 className="font-semibold text-white mb-2">
                  Modern Technology
                </h4>
                <p className="text-slate-400 text-sm">
                  Blockchain and AI bring ancient verification principles to the
                  digital age
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-6 text-center">
                <Sparkles className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <h4 className="font-semibold text-white mb-2">Future Vision</h4>
                <p className="text-slate-400 text-sm">
                  Building the financial infrastructure for tomorrow's global
                  economy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Metadata removed - use layout.jsx for metadata
