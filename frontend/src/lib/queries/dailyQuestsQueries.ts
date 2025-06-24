import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { DailyQuestsInterface } from "../../types";

export function useGetDailyQuests() {
  const { data, isLoading } = useQuery<DailyQuestsInterface[]>({
    queryKey: ["dailyQuests"],
    queryFn: async () => {
      const dailyQuests = await axios.get(
        "http://localhost:5000/api/daily-quests/",
        { withCredentials: true }
      );
      return dailyQuests.data.data as DailyQuestsInterface[];
    },
  });
  return { dailyQuests: data, isLoadingQuests: isLoading };
}

export function useEditDailyQuests() {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation<
    DailyQuestsInterface,
    Error,
    DailyQuestsInterface
  >({
    mutationFn: async (updatedDailyQuests) => {
      const res = await axios.patch(
        `http://localhost:5000/api/daily-quests/6829113e3e415187ca672eec`,
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
