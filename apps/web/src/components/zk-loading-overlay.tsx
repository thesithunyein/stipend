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
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-md">
      <div className="glass-card max-w-sm w-full mx-4 text-center space-y-6 p-8">
        {/* Animated spinner ring */}
        <div className="relative mx-auto w-20 h-20">
          <div className="absolute inset-0 rounded-full border-2 border-white/10" />
          <div className="absolute inset-0 rounded-full border-2 border-white/80 border-t-transparent animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <StepIcon className="w-8 h-8 text-white/80" />
          </div>
        </div>

        {/* Label */}
        <div>
          <h3 className="text-lg font-semibold text-white">{label}</h3>
          <p className="text-white/40 text-sm mt-1">
            This may take 5–15 seconds
          </p>
        </div>

        {/* Progress steps */}
        <div className="space-y-2 text-left">
          {PROGRESS_STEPS.map((step, i) => {
            const StepI = step.icon;
            const isActive = i === stepIndex;
            const isDone = i < stepIndex;
            return (
              <div
                key={i}
                className={`flex items-center gap-2 text-sm transition-all duration-300 ${
                  isActive
                    ? "text-white"
                    : isDone
                    ? "text-white/40"
                    : "text-white/20"
                }`}
              >
                {isActive ? (
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                ) : isDone ? (
                  <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
                  </div>
                ) : (
                  <StepI className="w-4 h-4 shrink-0" />
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
