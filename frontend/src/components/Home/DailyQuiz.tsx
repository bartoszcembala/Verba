import { useEffect, useState } from "react";
import { useProgress } from "../../lib/queries/progressQueries";
import { shuffleArray } from "../../lib/shuffle";
import Spinner from "../Spinner";
import toast from "react-hot-toast";
import { useEditUser } from "../../lib/queries/userQueries";
import { IoReload } from "react-icons/io5";
import { CiLock } from "react-icons/ci";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineCancel } from "react-icons/md";
import { useIncrementDailyQuest } from "../../lib/queries/dailyQuestsQueries";

function DailyQuiz() {
  const { incrementDailyQuest } = useIncrementDailyQuest();
  const { progress, isLoadingProgress } = useProgress();
  const { editUser } = useEditUser();
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const userProgress = progress?.filter(
    (progress) => progress.userName === user?.email,
  );
  const [currQuestion, setCurrQuestion] = useState(0);
  let learnedWords = userProgress?.reduce<string[][]>(
    (acc, curr) => acc.concat(curr.learned),
    [],
  );
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [refresh, setRefresh] = useState(0);

  type QuizItem = {
    translation: string;
    word: string;
    answers: string[][];
  };

  const [quizData, setQuizData] = useState<QuizItem[]>([
    { translation: "", word: "", answers: [] },
    { translation: "", word: "", answers: [] },
    { translation: "", word: "", answers: [] },
    { translation: "", word: "", answers: [] },
    { translation: "", word: "", answers: [] },
  ]);

  useEffect(() => {
    if (!learnedWords || learnedWords.length < 4) return;

    const availableWords = [...learnedWords.map((wordPair) => [...wordPair])];
    const newQuizData: QuizItem[] = [];

    for (let i = 0; i < 5 && availableWords.length > 0; i++) {
      const index = Math.floor(Math.random() * availableWords.length);
      const [word, translation] = availableWords.splice(index, 1)[0];

      const answers: string[][] = [];

      // Dodaj 3 losowe złe odpowiedzi
      while (answers.length < 3) {
        const rand = Math.floor(Math.random() * learnedWords.length);
        const wrongAnswer = learnedWords[rand];
        if (
          wrongAnswer[0] !== word &&
          !answers.some((a) => a[0] === wrongAnswer[0])
        ) {
          answers.push(wrongAnswer);
        }
      }

      // Dodaj poprawną odpowiedź
      answers.push([word, translation]);

      // Wymieszaj odpowiedzi
      const shuffledAnswers = shuffleArray(answers);

      newQuizData.push({
        word,
        translation,
        answers: shuffledAnswers,
      });
    }

    setQuizData(newQuizData);
  }, [progress, refresh]);

  function handleSelect(answer: string[]) {
    if (answer[0] === quizData[currQuestion]?.word) {
      setCorrect(correct + 1);
    } else if (answer[0] !== quizData[currQuestion]?.word) {
      setWrong(wrong + 1);
    }
    setCurrQuestion(currQuestion + 1);
    if (currQuestion + 1 === 5) {
      if (correct >= 4) {
        toast.success("Quiz completed! You earned 30 EXP.");
        editUser({
          id: user._id,
          data: { exp: user.exp + 30 * (user.streak.length / 100 + 1) },
        });
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            exp: user.exp + 30 * (user.streak.length / 100 + 1),
          }),
        );
        //Daily Quest logic
       incrementDailyQuest({ index: 2, userId: user._id });

        editUser({
          id: user._id,
          data: {
            quiz: {
              finished: true,
              date: new Date().toISOString().split("T")[0],
            },
          },
        });
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            quiz: {
              finished: true,
              date: new Date().toISOString().split("T")[0],
            },
          }),
        );
      }
    }
  }

  return (
    <div className="relative flex min-h-[22rem] items-center justify-center rounded-xl border border-neutral-200 bg-white p-7 dark:border-neutral-800 dark:bg-neutral-900">
      {learnedWords && learnedWords?.length >= 10 ? (
        <div>
          {isLoadingProgress && <Spinner />}
          {currQuestion < 5 &&
          user.quiz.date !== new Date().toISOString().split("T")[0] ? (
            <>
              <div className="absolute right-6 top-5 text-[1.25rem] text-neutral-500">
                <span className="text-emerald-600">{correct} correct</span> ·{" "}
                <span className="text-red-600">{wrong} wrong</span>
              </div>{" "}
              <div className="mb-7 text-center text-[2.5rem] font-semibold">
                {quizData[currQuestion]?.translation}
              </div>
              <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
                {quizData[currQuestion].answers.map((answer, i) => (
                  <div
                    onClick={() => handleSelect(answer)}
                    className="cursor-pointer rounded-lg border border-neutral-300 px-4 py-3 text-center text-[1.4rem] hover:border-indigo-400 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                    key={i}
                  >
                    {answer[0]}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center gap-5">
              <div>
                {" "}
                {user.quiz.date === new Date().toISOString().split("T")[0] ? (
                  <IoIosCheckmarkCircleOutline className="h-20 w-20 text-emerald-600" />
                ) : (
                  <MdOutlineCancel className="h-20 w-20 text-red-600" />
                )}
              </div>
              <div className="text-[2.2rem] font-semibold">
                {user.quiz.date === new Date().toISOString().split("T")[0] ? (
                  <span>Daily Quiz completed!</span>
                ) : (
                  <span>Try again!</span>
                )}
              </div>

              <button
                onClick={() => {
                  if (user.quiz.finished === true) {
                    editUser({
                      id: user._id,
                      data: {
                        quiz: {
                          finished: false,
                          date: "01-01-0001",
                        },
                      },
                    });
                    localStorage.setItem(
                      "user",
                      JSON.stringify({
                        ...user,
                        quiz: {
                          finished: false,
                          date: "01-01-0001",
                        },
                      }),
                    );
                    setCurrQuestion(0);
                    setCorrect(0);
                    setWrong(0);
                    setRefresh((prev) => prev + 1);
                  } else {
                    setCurrQuestion(0);
                    setCorrect(0);
                    setWrong(0);
                    setRefresh((prev) => prev + 1);
                  }
                }}
                className="absolute bottom-5 right-5 cursor-pointer text-neutral-500 hover:text-indigo-600"
              >
                <IoReload className="h-9 w-9 transition hover:rotate-180" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center gap-4 text-neutral-500">
          <CiLock className="h-9 w-9" />
          <p className="text-[1.6rem]">Learn at least 10 words to unlock the daily quiz.</p>
        </div>
      )}
    </div>
  );
}

export default DailyQuiz;
