import toast from "react-hot-toast";
import type { Dispatch, SetStateAction } from "react";
import type { AnswerStatus, ExercisePrompt, WordPair } from "../../components/Exercise/types";
import { fetchExercise } from "../fetchExercises";
import { shuffleArray } from "../shuffle";

export function getExerciseTranslate(
  setInputValue: Dispatch<SetStateAction<string>>,
  setIsCorrect: Dispatch<SetStateAction<AnswerStatus>>,
  setExercise: Dispatch<SetStateAction<ExercisePrompt>>,
  verbs: WordPair[],
  selectedVerbs: WordPair[],
) {
  setInputValue("");
  setIsCorrect("");


  const pickedVerb =
    selectedVerbs[Math.floor(Math.random() * selectedVerbs.length)];
  const array = [pickedVerb[0]];
  const answer = pickedVerb[0];

  for (let i = 0; i < 3; i++) {
    const random = verbs[Math.floor(Math.random() * verbs.length)][0];
    array.push(random);
  }

  setExercise({
    correctAnswer: answer,
    options: shuffleArray(array),
    question: `${pickedVerb[1]}`,
    translation: pickedVerb[0],
  });
}

export function getExerciseFill(
  setInputValue: Dispatch<SetStateAction<string>>,
  setIsCorrect: Dispatch<SetStateAction<AnswerStatus>>,
  setExercise: Dispatch<SetStateAction<ExercisePrompt>>,
  selectedVerbs: WordPair[],
) {
  const randomVerb =
    selectedVerbs[Math.floor(Math.random() * selectedVerbs.length)];
  setInputValue("");
  setIsCorrect("");

  toast.promise(fetchExercise(randomVerb, setExercise), {
    loading: "Generating exercise...",
    success: "Exercise generated",
    error: "Exercise could not be generated.",
  });
}
