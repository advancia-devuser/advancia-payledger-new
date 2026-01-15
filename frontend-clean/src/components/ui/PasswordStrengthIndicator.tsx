"use client";

import React from "react";
import { Check, X } from "lucide-react";

interface PasswordStrengthIndicatorProps {
  password: string;
  showRequirements?: boolean;
}

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  showRequirements = true,
}) => {
  const requirements: PasswordRequirement[] = [
    {
      label: "At least 8 characters",
      test: (pwd) => pwd.length >= 8,
    },
    {
      label: "Contains uppercase letter",
      test: (pwd) => /[A-Z]/.test(pwd),
    },
    {
      label: "Contains lowercase letter",
      test: (pwd) => /[a-z]/.test(pwd),
    },
    {
      label: "Contains number",
      test: (pwd) => /[0-9]/.test(pwd),
    },
    {
      label: "Contains special character",
      test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    },
  ];

  const metRequirements = requirements.filter((req) => req.test(password));
  const strength = metRequirements.length;

  const getStrengthLabel = () => {
    if (strength === 0) return "";
    if (strength <= 2) return "Weak";
    if (strength <= 3) return "Fair";
    if (strength <= 4) return "Good";
    return "Strong";
  };

  const getStrengthColor = () => {
    if (strength === 0) return "bg-gray-200";
    if (strength <= 2) return "bg-red-500";
    if (strength <= 3) return "bg-yellow-500";
    if (strength <= 4) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthTextColor = () => {
    if (strength === 0) return "text-gray-500";
    if (strength <= 2) return "text-red-600";
    if (strength <= 3) return "text-yellow-600";
    if (strength <= 4) return "text-blue-600";
    return "text-green-600";
  };

  if (!password) return null;

  return (
    <div className="space-y-3">
      {/* Strength Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-600">Password Strength</span>
          <span className={`text-xs font-medium ${getStrengthTextColor()}`}>
            {getStrengthLabel()}
          </span>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className={`h-1 flex-1 rounded-full transition-colors ${
                level <= strength ? getStrengthColor() : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Requirements List */}
      {showRequirements && (
        <div className="space-y-2">
          {requirements.map((requirement, index) => {
            const isMet = requirement.test(password);
            return (
              <div
                key={index}
                className="flex items-center gap-2 text-xs transition-colors"
              >
                {isMet ? (
                  <Check size={14} className="text-green-600 flex-shrink-0" />
                ) : (
                  <X size={14} className="text-gray-400 flex-shrink-0" />
                )}
                <span
                  className={isMet ? "text-green-600" : "text-gray-500"}
                >
                  {requirement.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;
