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
        "https://verba-production-3e8f.up.railway.app/api/daily-quests/",
        { withCredentials: true }
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
        `https://verba-production-3e8f.up.railway.app/api/daily-quests/${id}`,
        updatedDailyQuests
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
