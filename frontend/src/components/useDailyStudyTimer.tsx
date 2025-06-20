import { useEffect, useRef, useState } from "react";
import { useEditUser } from "../lib/queries/userQueries";
import {
  useEditDailyQuests,
  useGetDailyQuests,
} from "../lib/queries/dailyQuestsQueries";
import { useUpdateDailyQuests } from "../lib/useUpdateDailyQuests";

export const useDailyStudyTimer = (): number => {
  const [secondsToday, setSecondsToday] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const updateRef = useRef<NodeJS.Timeout | null>(null);
  const { editUser } = useEditUser();
  const { dailyQuests } = useGetDailyQuests();
  const { editDailyQuests } = useEditDailyQuests();
  const { handleUpdateDailyQuest } = useUpdateDailyQuests();

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    // Odczyt startowej wartości z localStorage
    const saved: Record<string, number> = JSON.parse(
      localStorage.getItem("studyTime") || "{}"
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
      if (!dailyQuests || dailyQuests.length === 0) return;

      const stored = localStorage.getItem("user");
      if (!stored) return;

      const user = JSON.parse(stored);
      const minutes = Math.floor(
        JSON.parse(localStorage.getItem("studyTime") || "{}")[today] / 60
      );

      const timeSpentLearningObj = {
        date: today,
        value: minutes,
      };

      console.log("Record Added:", timeSpentLearningObj);

      // Zapis do backendu
      editUser({
        id: user._id,
        data: {
          timeSpentLearning: [
            ...(user.timeSpentLearning.filter(
              ({ date, value }: { date: string; value: number }) =>
                date !== today
            ) || []),
            timeSpentLearningObj,
          ],
        },
      });

      //Daily Quest logic
      handleUpdateDailyQuest("spend 10 minutes learning");

      // Aktualizacja usera w localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          timeSpentLearning: [
            ...(user.timeSpentLearning.filter(
              ({ date, value }: { date: string; value: number }) =>
                date !== today
            ) || []),
            timeSpentLearningObj,
          ],
        })
      );
    }, 60000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (updateRef.current) clearInterval(updateRef.current);
    };
  }, [editUser, dailyQuests]);

  return secondsToday;
};
