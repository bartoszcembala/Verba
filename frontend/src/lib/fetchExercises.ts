import type { ExercisePrompt, WordPair } from "../components/Exercise/types";
import { apiUrl } from "./api";

export async function fetchExercise(
  randomVerb: WordPair,
): Promise<ExercisePrompt> {
  const response = await fetch(apiUrl("/exercises/generate"), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ word: randomVerb[0], translation: randomVerb[1] }),
  });

  if (!response.ok) throw new Error("Exercise generation failed");
  return response.json() as Promise<ExercisePrompt>;
}
