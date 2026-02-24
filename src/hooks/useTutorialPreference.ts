"use client";

import { useState, useEffect, useCallback } from "react";

export default function useTutorialPreference() {
  const [showTutorials, setShowTutorialsState] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem("showTutorials");
      if (stored !== null) {
        setShowTutorialsState(stored === "true");
      }
    } catch {
      // En cas de blocage du localStorage, on garde la valeur par défaut
    }
  }, []);

  const setShowTutorials = useCallback((value: boolean) => {
    setShowTutorialsState(value);
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem("showTutorials", value ? "true" : "false");
    } catch {
      // Ignorer les erreurs de persistance
    }
  }, []);

  const toggleTutorials = useCallback(() => {
    setShowTutorials(!showTutorials);
  }, [showTutorials]);

  return { showTutorials, setShowTutorials, toggleTutorials };
}

