import React, { useState } from "react";
import { Sparkles, Plus, Heart, Zap, Cloud, Moon, Sun } from "lucide-react";

const EmotionalGlyph = ({ emotion, size = "large" }) => {
  const sizeClass = size === "large" ? "w-64 h-64" : "w-32 h-32";

  return (
    <div className={`${sizeClass} relative`}>
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          {emotion.gradients?.map((grad, i) => (
            <linearGradient
              key={i}
              id={`grad-${emotion.id}-${i}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{ stopColor: grad.from, stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: grad.to, stopOpacity: 1 }}
              />
            </linearGradient>
          ))}
          {emotion.patterns?.map((pattern, i) => (
            <pattern
              key={i}
              id={`pattern-${emotion.id}-${i}`}
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="10"
                cy="10"
                r="2"
                fill={pattern.color}
                opacity="0.3"
              />
            </pattern>
          ))}
        </defs>

        {emotion.shapes?.map((shape, i) => {
          switch (shape.type) {
            case "circle":
              return (
                <circle
                  key={i}
                  cx={shape.cx}
                  cy={shape.cy}
                  r={shape.r}
                  fill={shape.fill}
                  opacity={shape.opacity || 1}
                  className={shape.animate ? "animate-pulse" : ""}
                />
              );
            case "wave":
              return (
                <path
                  key={i}
                  d={shape.d}
                  stroke={shape.stroke}
                  strokeWidth={shape.strokeWidth}
                  fill="none"
                  opacity={shape.opacity || 1}
                />
              );
            case "spiral":
              return (
                <path
                  key={i}
                  d={shape.d}
                  stroke={shape.stroke}
                  strokeWidth={shape.strokeWidth}
                  fill="none"
                  opacity={shape.opacity || 1}
                />
              );
            case "polygon":
              return (
                <polygon
                  key={i}
                  points={shape.points}
                  fill={shape.fill}
                  opacity={shape.opacity || 1}
                />
              );
            default:
              return null;
          }
        })}
      </svg>
    </div>
  );
};

const EmotionCreator = ({ onClose, onSave }) => {
  const [emotionName, setEmotionName] = useState("");
  const [emotionDescription, setEmotionDescription] = useState("");
  const [shapes, setShapes] = useState([
    { type: "circle", cx: 100, cy: 100, r: 60, fill: "#9370DB", opacity: 0.6 },
  ]);
  const [selectedShape, setSelectedShape] = useState(0);

  const shapeTypes = ["circle", "wave", "spiral", "polygon"];

  const addShape = (type) => {
    const newShape = {
      type,
      ...(type === "circle"
        ? { cx: 100, cy: 100, r: 40, fill: "#9370DB", opacity: 0.6 }
        : type === "wave"
        ? {
            d: "M 30 100 Q 60 80, 90 100 T 150 100",
            stroke: "#9370DB",
            strokeWidth: 2,
            opacity: 0.6,
          }
        : type === "spiral"
        ? {
            d: "M 100 100 Q 120 80 130 100 Q 140 120 130 140",
            stroke: "#9370DB",
            strokeWidth: 3,
            opacity: 0.7,
          }
        : {
            points: "100,40 120,80 140,80 120,120 80,120 60,80 80,80",
            fill: "#9370DB",
            opacity: 0.6,
          }),
    };
    setShapes([...shapes, newShape]);
    setSelectedShape(shapes.length);
  };

  const updateShape = (index, updates) => {
    const newShapes = [...shapes];
    newShapes[index] = { ...newShapes[index], ...updates };
    setShapes(newShapes);
  };

  const removeShape = (index) => {
    setShapes(shapes.filter((_, i) => i !== index));
    setSelectedShape(Math.max(0, index - 1));
  };

  const customEmotion = {
    id: "custom",
    name: emotionName || "Your Emotion",
    description: emotionDescription || "Describe your nameless feeling...",
    shapes,
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur rounded-3xl p-8 border border-slate-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-purple-300">
          Create Your Emotion
        </h2>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition"
        >
          ✕
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="flex justify-center mb-6">
            <EmotionalGlyph emotion={customEmotion} />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-purple-300 mb-2">
                Emotion Name
              </label>
              <input
                type="text"
                value={emotionName}
                onChange={(e) => setEmotionName(e.target.value)}
                placeholder="e.g., Anemoia, Kenopsia..."
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:border-purple-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-purple-300 mb-2">
                Description
              </label>
              <textarea
                value={emotionDescription}
                onChange={(e) => setEmotionDescription(e.target.value)}
                placeholder="Describe the feeling..."
                rows={3}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:border-purple-400 focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-purple-300 mb-3">
              Add Shapes
            </h3>
            <div className="flex gap-2 flex-wrap">
              {shapeTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => addShape(type)}
                  className="bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/50 rounded-lg px-4 py-2 text-sm transition capitalize"
                >
                  + {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-purple-300 mb-3">
              Layers ({shapes.length})
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {shapes.map((shape, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedShape(index)}
                  className={`p-3 rounded-lg cursor-pointer transition ${
                    selectedShape === index
                      ? "bg-purple-600/30 border border-purple-500"
                      : "bg-slate-900/30 border border-slate-700 hover:bg-slate-900/50"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="capitalize text-sm">{shape.type}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeShape(index);
                      }}
                      className="text-red-400 hover:text-red-300 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedShape < shapes.length && (
            <div className="bg-slate-900/50 rounded-lg p-4 space-y-3">
              <h3 className="text-sm font-semibold text-purple-300">
                Edit Selected Shape
              </h3>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Color
                </label>
                <input
                  type="color"
                  value={
                    shapes[selectedShape].fill ||
                    shapes[selectedShape].stroke ||
                    "#9370DB"
                  }
                  onChange={(e) => {
                    const colorField =
                      shapes[selectedShape].type === "circle" ||
                      shapes[selectedShape].type === "polygon"
                        ? "fill"
                        : "stroke";
                    updateShape(selectedShape, {
                      [colorField]: e.target.value,
                    });
                  }}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Opacity:{" "}
                  {Math.round((shapes[selectedShape].opacity || 1) * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={shapes[selectedShape].opacity || 1}
                  onChange={(e) =>
                    updateShape(selectedShape, {
                      opacity: parseFloat(e.target.value),
                    })
                  }
                  className="w-full"
                />
              </div>

              {shapes[selectedShape].type === "circle" && (
                <>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Size: {shapes[selectedShape].r}
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="90"
                      value={shapes[selectedShape].r}
                      onChange={(e) =>
                        updateShape(selectedShape, {
                          r: parseInt(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">
                        X: {shapes[selectedShape].cx}
                      </label>
                      <input
                        type="range"
                        min="20"
                        max="180"
                        value={shapes[selectedShape].cx}
                        onChange={(e) =>
                          updateShape(selectedShape, {
                            cx: parseInt(e.target.value),
                          })
                        }
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">
                        Y: {shapes[selectedShape].cy}
                      </label>
                      <input
                        type="range"
                        min="20"
                        max="180"
                        value={shapes[selectedShape].cy}
                        onChange={(e) =>
                          updateShape(selectedShape, {
                            cy: parseInt(e.target.value),
                          })
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex gap-4 justify-end">
        <button
          onClick={onClose}
          className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(customEmotion)}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg transition font-semibold"
        >
          Save Emotion
        </button>
      </div>
    </div>
  );
};

const EmotionalLanguage = () => {
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [showCreator, setShowCreator] = useState(false);
  const [customEmotions, setCustomEmotions] = useState([]);

  const namelessEmotions = [
    {
      id: "vellichor",
      name: "Vellichor",
      description:
        "The strange wistfulness of used bookstores, the nostalgia for lives not lived",
      shapes: [
        {
          type: "circle",
          cx: 100,
          cy: 100,
          r: 80,
          fill: "url(#grad-vellichor-0)",
          opacity: 0.3,
        },
        {
          type: "circle",
          cx: 100,
          cy: 100,
          r: 60,
          fill: "url(#grad-vellichor-1)",
          opacity: 0.4,
        },
        {
          type: "circle",
          cx: 100,
          cy: 100,
          r: 40,
          fill: "url(#grad-vellichor-2)",
          opacity: 0.5,
        },
        {
          type: "wave",
          d: "M 30 100 Q 60 80, 90 100 T 150 100",
          stroke: "#8B7355",
          strokeWidth: 2,
          opacity: 0.6,
        },
      ],
      gradients: [
        { from: "#DEB887", to: "#8B7355" },
        { from: "#F4A460", to: "#8B4513" },
        { from: "#D2691E", to: "#654321" },
      ],
    },
    {
      id: "sonder",
      name: "Sonder",
      description:
        "The realization that each passerby has a life as vivid and complex as your own",
      shapes: [
        {
          type: "circle",
          cx: 60,
          cy: 60,
          r: 25,
          fill: "#FF6B9D",
          opacity: 0.6,
          animate: true,
        },
        {
          type: "circle",
          cx: 140,
          cy: 140,
          r: 25,
          fill: "#4A90E2",
          opacity: 0.6,
          animate: true,
        },
        {
          type: "circle",
          cx: 140,
          cy: 60,
          r: 25,
          fill: "#FFA07A",
          opacity: 0.6,
          animate: true,
        },
        {
          type: "circle",
          cx: 60,
          cy: 140,
          r: 25,
          fill: "#98D8C8",
          opacity: 0.6,
          animate: true,
        },
        {
          type: "circle",
          cx: 100,
          cy: 100,
          r: 35,
          fill: "#FFD700",
          opacity: 0.4,
        },
      ],
    },
    {
      id: "jouska",
      name: "Jouska",
      description:
        "A hypothetical conversation you compulsively play out in your head",
      shapes: [
        {
          type: "spiral",
          d: "M 100 100 Q 120 80 130 100 Q 140 120 130 140 Q 110 150 90 140 Q 70 120 80 100 Q 90 80 100 90",
          stroke: "#6A0DAD",
          strokeWidth: 3,
          opacity: 0.7,
        },
        {
          type: "spiral",
          d: "M 100 100 Q 115 85 125 100 Q 135 115 125 130 Q 110 140 95 130 Q 80 115 90 100 Q 95 85 100 95",
          stroke: "#9370DB",
          strokeWidth: 2.5,
          opacity: 0.6,
        },
        {
          type: "circle",
          cx: 100,
          cy: 100,
          r: 5,
          fill: "#DDA0DD",
          opacity: 0.9,
        },
      ],
    },
    {
      id: "chrysalism",
      name: "Chrysalism",
      description:
        "The amniotic tranquility of being indoors during a thunderstorm",
      shapes: [
        {
          type: "circle",
          cx: 100,
          cy: 100,
          r: 90,
          fill: "url(#grad-chrysalism-0)",
          opacity: 0.3,
        },
        {
          type: "wave",
          d: "M 20 80 Q 50 60, 80 80 T 140 80 T 180 80",
          stroke: "#4682B4",
          strokeWidth: 2,
          opacity: 0.5,
        },
        {
          type: "wave",
          d: "M 20 120 Q 50 100, 80 120 T 140 120 T 180 120",
          stroke: "#5F9EA0",
          strokeWidth: 2,
          opacity: 0.5,
        },
        {
          type: "circle",
          cx: 100,
          cy: 100,
          r: 40,
          fill: "#FFD700",
          opacity: 0.2,
        },
      ],
      gradients: [{ from: "#1C1C3C", to: "#4A5568" }],
    },
    {
      id: "ambedo",
      name: "Ambedo",
      description:
        "A melancholic trance where you become absorbed in vivid sensory details",
      shapes: [
        {
          type: "polygon",
          points:
            "100,30 130,90 170,90 140,120 160,170 100,140 40,170 60,120 30,90 70,90",
          fill: "url(#grad-ambedo-0)",
          opacity: 0.5,
        },
        { type: "circle", cx: 100, cy: 100, r: 70, fill: "none", opacity: 0.3 },
        {
          type: "circle",
          cx: 100,
          cy: 100,
          r: 5,
          fill: "#FF1493",
          opacity: 0.9,
        },
      ],
      gradients: [{ from: "#FF69B4", to: "#FF1493" }],
    },
    {
      id: "opia",
      name: "Opia",
      description:
        "The intensity of looking someone in the eye, which can feel invasive or vulnerable",
      shapes: [
        {
          type: "circle",
          cx: 80,
          cy: 100,
          r: 40,
          fill: "#87CEEB",
          opacity: 0.6,
        },
        {
          type: "circle",
          cx: 80,
          cy: 100,
          r: 20,
          fill: "#4169E1",
          opacity: 0.8,
        },
        {
          type: "circle",
          cx: 80,
          cy: 100,
          r: 8,
          fill: "#000000",
          opacity: 0.9,
        },
        {
          type: "circle",
          cx: 120,
          cy: 100,
          r: 40,
          fill: "#87CEEB",
          opacity: 0.6,
        },
        {
          type: "circle",
          cx: 120,
          cy: 100,
          r: 20,
          fill: "#4169E1",
          opacity: 0.8,
        },
        {
          type: "circle",
          cx: 120,
          cy: 100,
          r: 8,
          fill: "#000000",
          opacity: 0.9,
        },
      ],
    },
    {
      id: "monachopsis",
      name: "Monachopsis",
      description: "The subtle but persistent feeling of being out of place",
      shapes: [
        {
          type: "polygon",
          points: "100,40 120,80 100,80",
          fill: "#708090",
          opacity: 0.7,
        },
        {
          type: "circle",
          cx: 60,
          cy: 120,
          r: 15,
          fill: "#2F4F4F",
          opacity: 0.6,
        },
        {
          type: "circle",
          cx: 140,
          cy: 140,
          r: 15,
          fill: "#2F4F4F",
          opacity: 0.6,
        },
        {
          type: "circle",
          cx: 80,
          cy: 160,
          r: 15,
          fill: "#2F4F4F",
          opacity: 0.6,
        },
        {
          type: "circle",
          cx: 120,
          cy: 120,
          r: 15,
          fill: "#2F4F4F",
          opacity: 0.6,
        },
      ],
    },
    {
      id: "liberosis",
      name: "Liberosis",
      description: "The desire to care less about things, to be more carefree",
      shapes: [
        {
          type: "circle",
          cx: 100,
          cy: 100,
          r: 80,
          fill: "url(#grad-liberosis-0)",
          opacity: 0.4,
        },
        {
          type: "wave",
          d: "M 40 100 Q 70 70, 100 100 T 160 100",
          stroke: "#87CEEB",
          strokeWidth: 3,
          opacity: 0.6,
        },
        {
          type: "circle",
          cx: 100,
          cy: 100,
          r: 10,
          fill: "#FFD700",
          opacity: 0.8,
        },
      ],
      gradients: [{ from: "#E0F7FA", to: "#B2EBF2" }],
    },
  ];

  const allEmotions = [...namelessEmotions, ...customEmotions];

  const handleSaveEmotion = (emotion) => {
    setCustomEmotions([
      ...customEmotions,
      { ...emotion, id: `custom-${Date.now()}` },
    ]);
    setShowCreator(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            The Language of Nameless Emotions
          </h1>
          <p className="text-xl text-slate-300 mb-6">
            A visual system for the feelings that live between words
          </p>
        </div>

        {showCreator ? (
          <EmotionCreator
            onClose={() => setShowCreator(false)}
            onSave={handleSaveEmotion}
          />
        ) : !selectedEmotion ? (
          <>
            <div className="flex justify-center mb-8">
              <button
                onClick={() => setShowCreator(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-full px-8 py-4 font-semibold text-lg transition flex items-center gap-3 shadow-lg"
              >
                <Plus size={24} />
                Create Your Own Emotion
              </button>
            </div>

            {customEmotions.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-purple-300 flex items-center gap-2">
                  <Sparkles size={24} />
                  Your Emotions
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {customEmotions.map((emotion) => (
                    <div
                      key={emotion.id}
                      onClick={() => setSelectedEmotion(emotion)}
                      className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur rounded-2xl p-6 cursor-pointer hover:from-purple-600/30 hover:to-pink-600/30 transition-all hover:scale-105 border-2 border-purple-500/50"
                    >
                      <EmotionalGlyph emotion={emotion} size="small" />
                      <h3 className="text-lg font-semibold mt-4 text-center text-purple-300">
                        {emotion.name}
                      </h3>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h2 className="text-2xl font-bold mb-6 text-purple-300">
                Discover Emotions
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {namelessEmotions.map((emotion) => (
                  <div
                    key={emotion.id}
                    onClick={() => setSelectedEmotion(emotion)}
                    className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 cursor-pointer hover:bg-slate-700/50 transition-all hover:scale-105 border border-slate-700"
                  >
                    <EmotionalGlyph emotion={emotion} size="small" />
                    <h3 className="text-lg font-semibold mt-4 text-center text-purple-300">
                      {emotion.name}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-slate-800/50 backdrop-blur rounded-3xl p-8 border border-slate-700">
            <button
              onClick={() => setSelectedEmotion(null)}
              className="mb-6 text-purple-400 hover:text-purple-300 transition"
            >
              ← Back to all emotions
            </button>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="flex justify-center">
                <EmotionalGlyph emotion={selectedEmotion} />
              </div>

              <div>
                <h2 className="text-4xl font-bold mb-4 text-purple-300">
                  {selectedEmotion.name}
                </h2>
                <p className="text-xl text-slate-300 leading-relaxed">
                  {selectedEmotion.description}
                </p>

                <div className="mt-8 p-6 bg-slate-900/50 rounded-xl">
                  <h3 className="text-lg font-semibold mb-3 text-purple-400">
                    Visual Language Key
                  </h3>
                  <ul className="space-y-2 text-slate-400">
                    <li>
                      • <strong>Circles:</strong> Intensity and focus
                    </li>
                    <li>
                      • <strong>Waves:</strong> Flowing, recurring thoughts
                    </li>
                    <li>
                      • <strong>Spirals:</strong> Repetitive mental loops
                    </li>
                    <li>
                      • <strong>Opacity:</strong> Clarity vs. ambiguity
                    </li>
                    <li>
                      • <strong>Multiple elements:</strong> Complexity and
                      layers
                    </li>
                    <li>
                      • <strong>Colors:</strong> Emotional temperature and tone
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 text-center">
          <div className="bg-slate-800/30 backdrop-blur rounded-2xl p-6 border border-slate-700/50">
            <h3 className="text-2xl font-semibold mb-3 text-purple-300">
              About This Language
            </h3>
            <p className="text-slate-300 max-w-3xl mx-auto">
              This visual language uses geometric shapes, colors, and patterns
              to express complex emotions that exist but have no common names in
              English. Each glyph combines elements that represent different
              aspects of the feeling—its intensity, movement, clarity, and
              emotional temperature.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmotionalLanguage;
