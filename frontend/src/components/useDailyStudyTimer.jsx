import { useEffect, useRef, useState } from "react";

export const useDailyStudyTimer = () => {
  const [secondsToday, setSecondsToday] = useState(0);
  const intervalRef = useRef(null);

  // Wczytaj czas z localStorage po załadowaniu strony
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const saved = JSON.parse(localStorage.getItem("studyTime")) || {};
    setSecondsToday(saved[today] || 0);

    // Start licznika
    intervalRef.current = setInterval(() => {
      setSecondsToday((prev) => {
        const updated = prev + 1;
        // Zapisz do localStorage
        const updatedData = {
          ...(JSON.parse(localStorage.getItem("studyTime")) || {}),
          [today]: updated,
        };
        localStorage.setItem("studyTime", JSON.stringify(updatedData));
        return updated;
      });
    }, 1000);

    // Zatrzymaj przy zamknięciu karty
    return () => clearInterval(intervalRef.current);
  }, []);

  return secondsToday;
};
