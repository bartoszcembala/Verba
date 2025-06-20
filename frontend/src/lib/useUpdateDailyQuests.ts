import { User } from "../types";
import {
  useEditDailyQuests,
  useGetDailyQuests,
} from "./queries/dailyQuestsQueries";
import { useEditUser } from "./queries/userQueries";

export function useUpdateDailyQuests() {
  const { dailyQuests } = useGetDailyQuests();
  const { editDailyQuests } = useEditDailyQuests();
  const { editUser } = useEditUser();
  const userJson = localStorage.getItem("user");
  const user: User | null = userJson ? JSON.parse(userJson) : null;
  const userDailyQuest =
    dailyQuests && dailyQuests.find((item) => item.userId === user?._id);

  function handleUpdateDailyQuest(questName: string) {
    if (dailyQuests) {
      //moze byc undefined
      const hasTitle = Object.values(userDailyQuest!).some(
        (value: any) => value?.title === questName && value?.completed === false
      );

      if (hasTitle && userDailyQuest) {
        const updatedDailyQuests = { ...userDailyQuest };
        for (const [key, value] of Object.entries(updatedDailyQuests)) {
          if (key.startsWith("quest") && (value as any).title === questName) {
            (value as any).progress += 1;
            if ((value as any).progress >= (value as any).toObtain) {
              (value as any).completed = true;
              if (user) {
                const multiplier = 1 + user.streak.length * 0.01;
                editUser({
                  id: user._id,
                  data: {
                    exp: user.exp + 20 * multiplier,
                  },
                });
                localStorage.setItem(
                  "user",
                  JSON.stringify({ ...user, exp: user.exp + 20 * multiplier })
                );
              }
            }
          }
        }

        editDailyQuests(updatedDailyQuests);
      }
    }
  }

  function handleDeleteDailyQuest(newDay: boolean = false) {
    if (userDailyQuest) {
      const updatedDailyQuests = { ...userDailyQuest };
      for (const [key, value] of Object.entries(updatedDailyQuests)) {
        if (key.startsWith("quest")) {
          (value as any).progress = 0;
          (value as any).completed = false;
        }
      }
      if (newDay) {
        updatedDailyQuests.day = new Date().toISOString().split("T")[0];
      }

      editDailyQuests(updatedDailyQuests);
    }
  }

  return { handleUpdateDailyQuest, handleDeleteDailyQuest };
}
