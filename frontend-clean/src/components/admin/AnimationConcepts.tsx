"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Wallet,
  Heart,
  TrendingUp,
  Layers,
  Zap,
  Globe,
  Users,
} from "lucide-react";

const AnimationConcepts = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const concepts = [
    {
      category: "Fintech/Crypto",
      icon: Wallet,
      color: "from-blue-500 to-cyan-500",
      ideas: [
        {
          title: "Blockchain Flow",
          description:
            "Animated blocks linking together with particle effects, showing transaction flow across networks",
          style: "Abstract/Technical",
        },
        {
          title: "Coin Morph",
          description:
            "Cryptocurrency symbols morphing into each other with liquid metal transitions",
          style: "3D/Motion Graphics",
        },
        {
          title: "Wallet Journey",
          description:
            "Isometric view of digital wallet opening to reveal floating coins and security shields",
          style: "Isometric/Explainer",
        },
      ],
    },
    {
      category: "Healthcare",
      icon: Heart,
      color: "from-red-500 to-pink-500",
      ideas: [
        {
          title: "Medical Heartbeat",
          description:
            "Heartbeat line transforms into hospital beds, appointments, and patient data flowing smoothly",
          style: "Line Art/Minimal",
        },
        {
          title: "Healing Particles",
          description:
            "Abstract particles forming into medical symbols (stethoscope, cross, etc.) with organic movement",
          style: "Particle System",
        },
        {
          title: "Facility Ecosystem",
          description:
            "Bird's eye view of medical facility with animated patient flow and room activity",
          style: "Top-Down/Infographic",
        },
      ],
    },
    {
      category: "Data Visualization",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
      ideas: [
        {
          title: "Live Dashboard",
          description:
            "Charts and graphs animating in real-time with smooth transitions and highlight effects",
          style: "UI/Motion Design",
        },
        {
          title: "Data Rivers",
          description:
            "Information flowing like rivers, splitting and merging to show data relationships",
          style: "Organic/Abstract",
        },
        {
          title: "Metric Galaxy",
          description:
            "KPIs as planets orbiting around a central dashboard, with connecting lines showing dependencies",
          style: "Space/Metaphor",
        },
      ],
    },
    {
      category: "Abstract/Creative",
      icon: Sparkles,
      color: "from-purple-500 to-pink-500",
      ideas: [
        {
          title: "Liquid Transitions",
          description:
            "Fluid morphing shapes that transition between different states/scenes with physics-based movement",
          style: "Fluid Dynamics",
        },
        {
          title: "Geometric Dance",
          description:
            "Minimalist geometric shapes expanding, rotating, and combining to tell a story",
          style: "Geometric/Minimal",
        },
        {
          title: "Glitch Art Reveal",
          description:
            "Digital glitch effects revealing content with RGB split and scan lines",
          style: "Cyberpunk/Digital",
        },
      ],
    },
    {
      category: "Character/Story",
      icon: Users,
      color: "from-orange-500 to-yellow-500",
      ideas: [
        {
          title: "User Journey Map",
          description:
            "Simple character moving through an illustrated landscape representing product features",
          style: "Explainer/Narrative",
        },
        {
          title: "Micro-interactions",
          description:
            "Delightful UI animations like button hovers, loading states, and success celebrations",
          style: "UI/UX Animation",
        },
        {
          title: "Avatar Evolution",
          description:
            "User profile icons transforming and leveling up through different stages",
          style: "Character/Gamification",
        },
      ],
    },
    {
      category: "Technical/Demo",
      icon: Zap,
      color: "from-indigo-500 to-blue-500",
      ideas: [
        {
          title: "API Connection Flow",
          description:
            "Animated diagram showing API requests flowing between services with success/error states",
          style: "Technical Diagram",
        },
        {
          title: "Code to Product",
          description:
            "Lines of code transforming into actual UI components with smooth transitions",
          style: "Developer/Meta",
        },
        {
          title: "System Architecture",
          description:
            "Layered tech stack with data flowing through each layer, highlighting key components",
          style: "Infographic/Technical",
        },
      ],
    },
    {
      category: "Marketing/Brand",
      icon: Globe,
      color: "from-teal-500 to-green-500",
      ideas: [
        {
          title: "Logo Reveal",
          description:
            "Dynamic logo animation with particle assembly, light reveals, or geometric builds",
          style: "Brand/Motion",
        },
        {
          title: "Feature Carousel",
          description:
            "Smooth scrolling showcase of product features with parallax and reveal effects",
          style: "Web/Interactive",
        },
        {
          title: "Trust Signals",
          description:
            "Security badges, user stats, and certifications animating in with emphasis",
          style: "Conversion/UX",
        },
      ],
    },
    {
      category: "Experimental",
      icon: Layers,
      color: "from-pink-500 to-purple-500",
      ideas: [
        {
          title: "AI Thought Process",
          description:
            "Neural network visualization with nodes lighting up and connections forming",
          style: "AI/Abstract",
        },
        {
          title: "Holographic UI",
          description:
            "Futuristic floating interfaces with depth, transparency, and light effects",
          style: "Sci-Fi/Future",
        },
        {
          title: "Quantum Particles",
          description:
            "Subatomic particle effects representing data encryption and security",
          style: "Abstract/Security",
        },
      ],
    },
  ];

  const filteredConcepts =
    selectedCategory === "all"
      ? concepts
      : concepts.filter((c) => c.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Sparkles className="text-yellow-400" size={40} />
            Animation Concepts Gallery
          </h1>
          <p className="text-slate-300 text-lg">
            Explore diverse animation ideas across multiple categories
          </p>
        </header>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              selectedCategory === "all"
                ? "bg-white text-slate-900 shadow-lg scale-105"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            All Categories
          </button>
          {concepts.map((concept) => (
            <button
              key={concept.category}
              onClick={() => setSelectedCategory(concept.category)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedCategory === concept.category
                  ? "bg-white text-slate-900 shadow-lg scale-105"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {concept.category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredConcepts.map((concept) => {
            const IconComponent = concept.icon;
            return (
              <div key={concept.category} className="space-y-4">
                <div
                  className={`bg-gradient-to-r ${concept.color} p-6 rounded-2xl shadow-xl`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <IconComponent className="text-white" size={28} />
                    <h2 className="text-2xl font-bold text-white">
                      {concept.category}
                    </h2>
                  </div>
                </div>

                {concept.ideas.map((idea, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-800 p-6 rounded-xl hover:bg-slate-750 transition-all hover:shadow-2xl hover:scale-105 cursor-pointer border border-slate-700 hover:border-slate-500"
                  >
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {idea.title}
                    </h3>
                    <p className="text-slate-300 mb-3 text-sm leading-relaxed">
                      {idea.description}
                    </p>
                    <span className="inline-block px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-xs font-medium">
                      {idea.style}
                    </span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        <div className="mt-16 bg-slate-800 rounded-2xl p-8 border border-slate-700">
          <h3 className="text-2xl font-bold text-white mb-4">💡 Quick Tips</h3>
          <div className="grid md:grid-cols-2 gap-4 text-slate-300">
            <div>
              <strong className="text-white">Keep it purposeful:</strong>{" "}
              Animation should enhance understanding, not distract
            </div>
            <div>
              <strong className="text-white">Timing is key:</strong> 200-500ms
              for most UI animations, longer for storytelling
            </div>
            <div>
              <strong className="text-white">Ease matters:</strong> Use easing
              functions (ease-out, ease-in-out) for natural movement
            </div>
            <div>
              <strong className="text-white">Test performance:</strong> Aim for
              60fps, optimize for mobile devices
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimationConcepts;
