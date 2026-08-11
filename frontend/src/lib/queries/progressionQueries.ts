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
      localStorage.setItem("user", JSON.stringify(user));
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
  const recordCorrectExerciseAnswer = useCallback(
    (learnedNewWord: boolean) => run({
      path: "exercises/correct",
      body: { learnedNewWord },
    }),
    [run],
  );
  const completeDailyQuiz = useCallback(
    (correctAnswers: number) => run({
      path: "daily-quiz/complete",
      body: { correctAnswers, totalQuestions: 5 },
    }),
    [run],
  );

  return {
    recordActivity,
    touchStreak,
    recordStudyTime,
    completeLesson,
    recordCorrectExerciseAnswer,
    completeDailyQuiz,
    isUpdatingProgression: mutation.isPending,
  };
}
