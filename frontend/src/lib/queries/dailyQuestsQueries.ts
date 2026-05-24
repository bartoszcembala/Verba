import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { DailyQuestsInterface } from "../../types";

interface DailyQuestsInput {
  updatedDailyQuests: DailyQuestsInterface;
  id: string;
}

export function useGetDailyQuests() {
  const { data, isLoading, refetch } = useQuery<DailyQuestsInterface[]>({
    queryKey: ["dailyQuests"],
    queryFn: async () => {
      const dailyQuests = await axios.get(
        `https://verba-ywgu.onrender.com/api/daily-quests/`,
        { withCredentials: true },
      );
      return dailyQuests.data.data as DailyQuestsInterface[];
    },
  });
  return { dailyQuests: data, isLoadingQuests: isLoading, refetch };
}

export function useEditDailyQuests() {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation<
    DailyQuestsInterface,
    Error,
    DailyQuestsInput
  >({
    mutationFn: async ({ updatedDailyQuests, id }) => {
      const res = await axios.patch(
        `https://verba-ywgu.onrender.com/api/daily-quests/${id}`,
        updatedDailyQuests,
      );

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dailyQuests"] });
      queryClient.refetchQueries({ queryKey: ["dailyQuests"] });
    },
  });

  return { editDailyQuests: mutateAsync };
}

interface IncrementDailyQuestInput {
  index: number;
  userId: string;
}

export function useIncrementDailyQuest() {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation<
    DailyQuestsInterface,
    Error,
    IncrementDailyQuestInput
  >({
    mutationFn: async ({ index, userId }) => {
      console.log(
        "Incrementing daily quest at index:",
        index,
        "for userId:",
        userId,
      );
      const res = await axios.patch(
        "https://verba-ywgu.onrender.com/api/daily-quests/increment",
        { index, userId },
        { withCredentials: true },
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dailyQuests"] });
      queryClient.refetchQueries({ queryKey: ["dailyQuests"] });
    },
  });

  return { incrementDailyQuest: mutateAsync };
}
