// Typography Configuration - Advancia Pay
// Platform: Major Second (1.125) - Professional, data-dense interfaces
// Marketing: Major Third (1.250) - Strong visual hierarchy

export interface TypographyScale {
  name: string;
  sizePx: number;
  sizeRem: number;
  useCase: string;
}

export interface TypographyConfig {
  baseSize: number;
  ratio: number;
  scale: TypographyScale[];
  lineHeights: {
    tight: number;
    normal: number;
    relaxed: number;
  };
  fontWeights: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
    extrabold: number;
  };
  fontFamilies: {
    sans: string;
    mono: string;
    display: string;
  };
}

export const generateScale = (
  baseSize: number,
  ratio: number,
  prefix: string = "text"
): TypographyScale[] => {
  const scales: TypographyScale[] = [];

  // Generate scale from xs to 5xl
  const multipliers = [
    {
      name: "xs",
      multiplier: 1 / (ratio * ratio),
      useCase: "Tiny labels, metadata",
    },
    { name: "sm", multiplier: 1 / ratio, useCase: "Small text, captions" },
    { name: "base", multiplier: 1, useCase: "Body text" },
    { name: "lg", multiplier: ratio, useCase: "Large body" },
    { name: "xl", multiplier: ratio * ratio, useCase: "Subheadings" },
    {
      name: "2xl",
      multiplier: ratio * ratio * ratio,
      useCase: "Section headings",
    },
    {
      name: "3xl",
      multiplier: ratio * ratio * ratio * ratio,
      useCase: "Page titles",
    },
    {
      name: "4xl",
      multiplier: ratio * ratio * ratio * ratio * ratio,
      useCase: "Hero headings",
    },
    {
      name: "5xl",
      multiplier: ratio * ratio * ratio * ratio * ratio * ratio,
      useCase: "Display headings",
    },
  ];

  multipliers.forEach(({ name, multiplier, useCase }) => {
    const sizePx = Math.round(baseSize * multiplier * 100) / 100;
    const sizeRem = Math.round((sizePx / 16) * 1000) / 1000;

    scales.push({
      name: `${prefix}-${name}`,
      sizePx,
      sizeRem,
      useCase,
    });
  });

  return scales;
};

// Platform Configuration (Major Second - 1.125)
export const platformConfig: TypographyConfig = {
  baseSize: 16,
  ratio: 1.125,
  scale: generateScale(16, 1.125, "text"),
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  fontFamilies: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    mono: '"Courier New", monospace',
    display: '"Inter", system-ui, sans-serif',
  },
};

// Marketing Configuration (Major Third - 1.250)
export const marketingConfig: TypographyConfig = {
  baseSize: 16,
  ratio: 1.25,
  scale: generateScale(16, 1.25, "marketing"),
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  fontFamilies: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    mono: '"Courier New", monospace',
    display: '"Inter", system-ui, sans-serif',
  },
};

// Utility functions
export const getFontSize = (config: TypographyConfig, size: string): string => {
  const scale = config.scale.find((s) => s.name === size);
  return scale ? `${scale.sizeRem}rem` : "1rem";
};

export const getLineHeight = (
  config: TypographyConfig,
  height: "tight" | "normal" | "relaxed"
): string => {
  return config.lineHeights[height].toString();
};

export const getFontWeight = (
  config: TypographyConfig,
  weight: keyof typeof config.fontWeights
): string => {
  return config.fontWeights[weight].toString();
};

export const getFontFamily = (
  config: TypographyConfig,
  family: keyof typeof config.fontFamilies
): string => {
  return config.fontFamilies[family];
};

// CSS Variables Generator
export const generateCSSVariables = (
  config: TypographyConfig,
  prefix: string = ""
): string => {
  let css = "";

  // Font sizes
  config.scale.forEach((scale) => {
    css += `  --${prefix}${scale.name}: ${scale.sizeRem}rem; /* ${scale.sizePx}px - ${scale.useCase} */\n`;
  });

  // Line heights
  Object.entries(config.lineHeights).forEach(([name, value]) => {
    css += `  --${prefix}leading-${name}: ${value};\n`;
  });

  // Font weights
  Object.entries(config.fontWeights).forEach(([name, value]) => {
    css += `  --${prefix}font-${name}: ${value};\n`;
  });

  // Font families
  Object.entries(config.fontFamilies).forEach(([name, value]) => {
    css += `  --${prefix}font-${name}: ${value};\n`;
  });

  return css;
};

// Export default configs
export default {
  platform: platformConfig,
  marketing: marketingConfig,
  generateScale,
  getFontSize,
  getLineHeight,
  getFontWeight,
  getFontFamily,
  generateCSSVariables,
};
