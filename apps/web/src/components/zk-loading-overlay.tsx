"use client";

import { Loader2, Shield, Fingerprint, Cpu } from "lucide-react";
import { useEffect, useState } from "react";

interface ZkLoadingOverlayProps {
  isVisible: boolean;
  /** Short label like "Claiming payment" or "Running payroll" */
  label: string;
}

const PROGRESS_STEPS = [
  { icon: Fingerprint, text: "Generating zero-knowledge proof..." },
  { icon: Cpu, text: "Computing Merkle inclusion proof..." },
  { icon: Shield, text: "Verifying proof integrity..." },
];

export function ZkLoadingOverlay({ isVisible, label }: ZkLoadingOverlayProps) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setStepIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < PROGRESS_STEPS.length - 1 ? prev + 1 : prev));
    }, 4000);
    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  const currentStep = PROGRESS_STEPS[stepIndex];
  const StepIcon = currentStep.icon;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60">
      <div className="bg-[#161618] border border-[#2A2A2E] rounded-lg max-w-sm w-full mx-4 p-6 space-y-5">
        {/* Spinner */}
        <div className="relative mx-auto w-10 h-10">
          <div className="absolute inset-0 rounded-full border-2 border-[#1E1E20]" />
          <div className="absolute inset-0 rounded-full border-2 border-[#5E6AD2] border-t-transparent animate-spin" />
        </div>

        {/* Label */}
        <div className="text-center">
          <h3 className="text-sm font-medium text-[#F5F5F5]">{label}</h3>
          <p className="text-xs text-[#6B6F76] mt-1">
            This may take 5–15 seconds
          </p>
        </div>

        {/* Progress steps */}
        <div className="space-y-2">
          {PROGRESS_STEPS.map((step, i) => {
            const isActive = i === stepIndex;
            const isDone = i < stepIndex;
            return (
              <div
                key={i}
                className={`flex items-center gap-2.5 text-xs transition-colors duration-200 ${
                  isActive
                    ? "text-[#F5F5F5]"
                    : isDone
                    ? "text-[#6B6F76]"
                    : "text-[#2A2A2E]"
                }`}
              >
                {isActive ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0 text-[#5E6AD2]" />
                ) : isDone ? (
                  <svg className="w-3.5 h-3.5 shrink-0 text-[#4ADE80]" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 8.5l3.5 3.5L13 4.5" />
                  </svg>
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-[#2A2A2E] shrink-0" />
                )}
                <span>{step.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
