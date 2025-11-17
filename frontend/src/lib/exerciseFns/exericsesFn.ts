import toast from "react-hot-toast";
import { fetchExercise } from "../fetchExercises";
import { shuffleArray } from "../shuffle";

export function getExerciseTranslate(
  setInputValue: (v: string) => void,
  //v:any do zmiany
  setIsCorrect: (v: any) => void,
  setExercise: (v: any) => void,
  verbs: string[],
  selectedVerbs: string[][]
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
  });
}

export function getExerciseFill(
  setInputValue: (v: string) => void,
  //v:any do zmiany
  setIsCorrect: (v: any) => void,
  setExercise: (v: any) => void,
  selectedVerbs: string[][]
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
