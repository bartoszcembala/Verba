import { useQuery } from "@tanstack/react-query";
import type { DailyQuestsInterface } from "../../types";
import { apiUrl } from "../api";

type ApiResponse<T> = {
  data: T;
};

export function useGetDailyQuests() {
  const query = useQuery<DailyQuestsInterface>({
    queryKey: ["dailyQuests"],
    queryFn: async () => {
      const response = await fetch(apiUrl("/daily-quests/me"), {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Unable to load daily quests");
      const body = await response.json() as ApiResponse<DailyQuestsInterface>;
      return body.data;
    },
  });

  return {
    dailyQuests: query.data,
    isLoadingQuests: query.isLoading,
    refetch: query.refetch,
  };
}
