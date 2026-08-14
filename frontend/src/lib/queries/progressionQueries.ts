import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import type { User } from "../../types";
import { apiUrl } from "../api";

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

type ProgressionCommand = {
  path: string;
  body?: Record<string, unknown>;
};

export function useProgression() {
  const queryClient = useQueryClient();
  const mutation = useMutation<User, Error, ProgressionCommand>({
    mutationFn: async ({ path, body }) => {
      const response = await fetch(apiUrl(`/progression/${path}`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: body ? JSON.stringify(body) : undefined,
      });
      const payload = await response.json() as ApiResponse<User>;
      if (!response.ok) throw new Error(payload.message || "Unable to update progression");
      return payload.data;
    },
    onSuccess: (user, command) => {
      queryClient.setQueryData(["currentUser"], user);
      if (!["activity", "streak"].includes(command.path)) {
        void queryClient.invalidateQueries({ queryKey: ["dailyQuests"] });
      }
    },
  });

  const run = mutation.mutateAsync;
  const recordActivity = useCallback(
    (input: { path: string; label: string }) => run({ path: "activity", body: input }),
    [run],
  );
  const touchStreak = useCallback(() => run({ path: "streak" }), [run]);
  const recordStudyTime = useCallback(
    (minutes: number) => run({ path: "study-time", body: { minutes } }),
    [run],
  );
  const completeLesson = useCallback(
    (lessonId: string) => run({ path: `lessons/${encodeURIComponent(lessonId)}/complete` }),
    [run],
  );
  const submitExerciseAnswer = useCallback(
    (input: { moduleName: string; word: string; answer: string }) => run({
      path: "exercises/answer",
      body: input,
    }),
    [run],
  );
  const resetExerciseProgress = useCallback(
    (moduleName: string) => run({
      path: `exercises/${encodeURIComponent(moduleName)}/reset`,
    }),
    [run],
  );
  const completeDailyQuiz = useCallback(
    (answers: Array<{ word: string; answer: string }>) => run({
      path: "daily-quiz/complete",
      body: { answers },
    }),
    [run],
  );

  return {
    recordActivity,
    touchStreak,
    recordStudyTime,
    completeLesson,
    submitExerciseAnswer,
    resetExerciseProgress,
    completeDailyQuiz,
    isUpdatingProgression: mutation.isPending,
  };
}
