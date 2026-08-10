import type { Dispatch, SetStateAction } from "react";
import type { ExercisePrompt, WordPair } from "../components/Exercise/types";
import { apiUrl } from "./api";

export async function fetchExercise(
  randomVerb: WordPair,
  setExercise: Dispatch<SetStateAction<ExercisePrompt>>,
): Promise<void> {
  const response = await fetch(apiUrl("/exercises/generate"), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ word: randomVerb[0], translation: randomVerb[1] }),
  });

  if (!response.ok) throw new Error("Exercise generation failed");
  const exercise = await response.json() as ExercisePrompt;
  setExercise(exercise);
}
