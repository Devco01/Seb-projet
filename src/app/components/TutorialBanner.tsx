"use client";

import { FaLightbulb, FaTimes } from "react-icons/fa";
import useTutorialPreference from "../../hooks/useTutorialPreference";

interface TutorialBannerProps {
  title: string;
  steps: string[];
}

export default function TutorialBanner({ title, steps }: TutorialBannerProps) {
  const { showTutorials, setShowTutorials } = useTutorialPreference();

  if (!showTutorials) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
      <div className="flex items-start">
        <div className="mt-1 mr-3">
          <FaLightbulb className="text-yellow-500" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-yellow-900">{title}</h3>
          <ul className="mt-2 text-sm text-yellow-800 list-disc list-inside space-y-1">
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setShowTutorials(false)}
        className="self-end text-xs text-yellow-800 hover:text-yellow-900 inline-flex items-center"
      >
        <FaTimes className="mr-1" />
        Masquer ces tutoriels
      </button>
    </div>
  );
}

