import { useEffect, useRef, useState } from "react";
import { useProgression } from "../lib/queries/progressionQueries";
import {
  useGetDailyQuests,
} from "../lib/queries/dailyQuestsQueries";
import { todayInWarsaw } from "../lib/today";

export const useDailyStudyTimer = (): number => {
  const [secondsToday, setSecondsToday] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const updateRef = useRef<NodeJS.Timeout | null>(null);
  const { recordStudyTime } = useProgression();
  const { dailyQuests } = useGetDailyQuests();

  useEffect(() => {
    const today = todayInWarsaw();

    // Odczyt startowej wartości z localStorage
    const saved: Record<string, number> = JSON.parse(
      localStorage.getItem("studyTime") || "{}",
    );
    setSecondsToday(saved[today] || 0);

    // Odliczanie sekund co 1 sekundę
    intervalRef.current = setInterval(() => {
      setSecondsToday((prev) => {
        const updated = prev + 1;
        const updatedData: Record<string, number> = {
          ...JSON.parse(localStorage.getItem("studyTime") || "{}"),
          [today]: updated,
        };
        localStorage.setItem("studyTime", JSON.stringify(updatedData));
        return updated;
      });
    }, 1000);

    // Wysyłka danych do backendu co 1 minutę
    updateRef.current = setInterval(() => {
      if (!dailyQuests) return;

      const minutes = Math.floor(
        JSON.parse(localStorage.getItem("studyTime") || "{}")[today] / 60,
      );
      void recordStudyTime(minutes);
    }, 60000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (updateRef.current) clearInterval(updateRef.current);
    };
  }, [dailyQuests, recordStudyTime]);

  return secondsToday;
};
