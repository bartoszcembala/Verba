import { useEffect, useRef, useState } from "react";

//////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
//MIGRACJA NA TS NIE SPRAWDZONA: DO SPRAWDZENIA

export const useDailyStudyTimer = (): number => {
  const [secondsToday, setSecondsToday] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const saved: Record<string, number> = JSON.parse(
      localStorage.getItem("studyTime") || "{}"
    );
    setSecondsToday(saved[today] || 0);

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

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return secondsToday;
};
