import React from "react";
import { cn } from "@/lib/utils";

interface TypographyProps {
  variant?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
  marketingVariant?:
    | "xs"
    | "sm"
    | "base"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl";
  weight?: "light" | "normal" | "medium" | "semibold" | "bold" | "extrabold";
  leading?: "tight" | "normal" | "relaxed";
  family?: "sans" | "mono" | "display";
  className?: string;
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
}

export const Typography: React.FC<TypographyProps> = ({
  variant,
  marketingVariant,
  weight = "normal",
  leading = "normal",
  family = "sans",
  className,
  children,
  as: Component = "span",
}) => {
  const getVariantClasses = () => {
    if (marketingVariant) {
      return `marketing-${marketingVariant}`;
    }
    if (variant) {
      return `text-${variant}`;
    }
    return "text-base";
  };

  const classes = cn(
    getVariantClasses(),
    `font-${weight}`,
    `leading-${leading}`,
    `font-${family}`,
    className
  );

  return <Component className={classes}>{children}</Component>;
};

// Specialized typography components
export const Heading: React.FC<{
  level: 1 | 2 | 3 | 4 | 5 | 6;
  marketing?: boolean;
  className?: string;
  children: React.ReactNode;
}> = ({ level, marketing = false, className, children }) => {
  const getHeadingClasses = () => {
    if (marketing) {
      switch (level) {
        case 1:
          return "marketing-5xl font-bold leading-tight";
        case 2:
          return "marketing-3xl font-semibold leading-tight";
        case 3:
          return "marketing-xl font-semibold leading-tight";
        case 4:
          return "marketing-lg font-medium leading-tight";
        case 5:
          return "marketing-base font-medium leading-normal";
        case 6:
          return "marketing-sm font-medium leading-normal";
        default:
          return "marketing-3xl font-semibold leading-tight";
      }
    } else {
      switch (level) {
        case 1:
          return "text-3xl font-bold leading-tight";
        case 2:
          return "text-2xl font-semibold leading-tight";
        case 3:
          return "text-xl font-semibold leading-tight";
        case 4:
          return "text-lg font-medium leading-tight";
        case 5:
          return "text-base font-medium leading-normal";
        case 6:
          return "text-sm font-medium leading-normal";
        default:
          return "text-2xl font-semibold leading-tight";
      }
    }
  };

  const Component = `h${level}` as keyof JSX.IntrinsicElements;
  const classes = cn(getHeadingClasses(), className);

  return <Component className={classes}>{children}</Component>;
};

export const Body: React.FC<{
  size?: "sm" | "base" | "lg";
  marketing?: boolean;
  className?: string;
  children: React.ReactNode;
}> = ({ size = "base", marketing = false, className, children }) => {
  const getBodyClasses = () => {
    if (marketing) {
      switch (size) {
        case "sm":
          return "marketing-sm leading-relaxed";
        case "lg":
          return "marketing-lg leading-relaxed";
        default:
          return "marketing-base leading-relaxed";
      }
    } else {
      switch (size) {
        case "sm":
          return "text-sm leading-normal";
        case "lg":
          return "text-lg leading-normal";
        default:
          return "text-base leading-normal";
      }
    }
  };

  const classes = cn(getBodyClasses(), className);

  return <p className={classes}>{children}</p>;
};

export const Caption: React.FC<{
  marketing?: boolean;
  className?: string;
  children: React.ReactNode;
}> = ({ marketing = false, className, children }) => {
  const classes = cn(
    marketing ? "marketing-xs" : "text-xs",
    "leading-normal",
    className
  );

  return <span className={classes}>{children}</span>;
};

export const Label: React.FC<{
  marketing?: boolean;
  className?: string;
  children: React.ReactNode;
}> = ({ marketing = false, className, children }) => {
  const classes = cn(
    marketing ? "marketing-sm" : "text-sm",
    "font-medium",
    "leading-normal",
    className
  );

  return <span className={classes}>{children}</span>;
};

// Utility component for readable content
export const ReadableContent: React.FC<{
  maxWidth?: "narrow" | "readable" | "wide";
  className?: string;
  children: React.ReactNode;
}> = ({ maxWidth = "readable", className, children }) => {
  const classes = cn(`text-${maxWidth}`, "leading-relaxed", className);

  return <div className={classes}>{children}</div>;
};

// Marketing-specific components
export const MarketingHeading: React.FC<{
  level: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  children: React.ReactNode;
}> = ({ level, className, children }) => {
  return (
    <Heading level={level} marketing className={className}>
      {children}
    </Heading>
  );
};

export const MarketingBody: React.FC<{
  size?: "sm" | "base" | "lg";
  className?: string;
  children: React.ReactNode;
}> = ({ size = "base", className, children }) => {
  return (
    <Body size={size} marketing className={className}>
      {children}
    </Body>
  );
};

export const MarketingCaption: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => {
  return (
    <Caption marketing className={className}>
      {children}
    </Caption>
  );
};

// Platform-specific components
export const PlatformHeading: React.FC<{
  level: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  children: React.ReactNode;
}> = ({ level, className, children }) => {
  return (
    <Heading level={level} marketing={false} className={className}>
      {children}
    </Heading>
  );
};

export const PlatformBody: React.FC<{
  size?: "sm" | "base" | "lg";
  className?: string;
  children: React.ReactNode;
}> = ({ size = "base", className, children }) => {
  return (
    <Body size={size} marketing={false} className={className}>
      {children}
    </Body>
  );
};

export const PlatformCaption: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => {
  return (
    <Caption marketing={false} className={className}>
      {children}
    </Caption>
  );
};

export default Typography;
