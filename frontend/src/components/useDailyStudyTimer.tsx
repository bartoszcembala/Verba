import { useEffect, useRef, useState } from "react";
import { useProgression } from "../lib/queries/progressionQueries";
import { useGetDailyQuests } from "../lib/queries/dailyQuestsQueries";
import { useCurrentUser } from "../lib/queries/userQueries";
import { todayInWarsaw } from "../lib/today";

export const useDailyStudyTimer = (): number => {
  const { user } = useCurrentUser();
  const { recordStudyTime } = useProgression();
  const { dailyQuests } = useGetDailyQuests(Boolean(user));
  const [secondsToday, setSecondsToday] = useState(0);
  const secondsRef = useRef(0);
  const userId = user?._id;
  const today = todayInWarsaw();
  const recordedMinutes = user?.timeSpentLearning.find((entry) => entry.date === today)?.value ?? 0;

  useEffect(() => {
    if (!userId) {
      secondsRef.current = 0;
      setSecondsToday(0);
      return;
    }

    const initialSeconds = recordedMinutes * 60;
    secondsRef.current = initialSeconds;
    setSecondsToday(initialSeconds);

    const tick = window.setInterval(() => {
      secondsRef.current += 1;
      setSecondsToday(secondsRef.current);
    }, 1000);

    const persist = window.setInterval(() => {
      if (!dailyQuests) return;
      void recordStudyTime(Math.floor(secondsRef.current / 60));
    }, 60000);

    return () => {
      window.clearInterval(tick);
      window.clearInterval(persist);
    };
  }, [dailyQuests, recordedMinutes, recordStudyTime, userId]);

  return secondsToday;
};
