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
    <section className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
      {learnedWords && learnedWords?.length >= 10 ? (
        <div>
          {isLoadingProgress && <Spinner />}
          {currQuestion < 5 &&
          user.quiz.date !== new Date().toISOString().split("T")[0] ? (
            <>
              <header className="flex items-center justify-between border-b border-neutral-100 px-6 py-4 dark:border-neutral-800 sm:px-8">
                <div>
                  <p className="text-[1.4rem] font-semibold">Daily review</p>
                  <p className="mt-0.5 text-[1.2rem] text-neutral-500">Question {currQuestion + 1} of 5</p>
                </div>
                <div className="flex items-center gap-2" aria-label={`${currQuestion} of 5 questions completed`}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span key={index} className={`h-2 rounded-full transition-all ${index < currQuestion ? "w-6 bg-indigo-600" : index === currQuestion ? "w-10 bg-indigo-600" : "w-6 bg-neutral-200 dark:bg-neutral-700"}`} />
                  ))}
                </div>
              </header>

              <div className="px-6 py-8 sm:px-8 sm:py-10">
                <div className="mb-8 text-center">
                  <p className="mb-2 text-[1.2rem] font-medium uppercase tracking-wide text-neutral-400">Choose the Spanish word</p>
                  <h2 className="text-[2.8rem] font-semibold tracking-tight sm:text-[3.2rem]">{quizData[currQuestion]?.translation}</h2>
                </div>
                <div className="mx-auto grid max-w-[70rem] grid-cols-1 gap-3 sm:grid-cols-2">
                  {quizData[currQuestion].answers.map((answer, i) => (
                    <button
                      type="button"
                      onClick={() => handleSelect(answer)}
                      className="group flex min-h-20 cursor-pointer items-center justify-between rounded-lg border border-neutral-200 px-5 py-3 text-left text-[1.45rem] font-medium transition hover:border-indigo-400 hover:bg-indigo-50/60 dark:border-neutral-700 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/20"
                      key={i}
                    >
                      <span>{answer[0]}</span>
                      <span className="grid h-8 w-8 place-items-center rounded-md bg-neutral-100 text-[1.1rem] text-neutral-400 group-hover:bg-indigo-100 group-hover:text-indigo-700 dark:bg-neutral-800 dark:group-hover:bg-indigo-950 dark:group-hover:text-indigo-300">{String.fromCharCode(65 + i)}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-7 flex items-center justify-center gap-3 text-[1.2rem] text-neutral-400">
                  <span>{correct} correct</span><span>·</span><span>{wrong} incorrect</span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-start gap-5 p-8 text-left sm:min-h-[13rem] sm:flex-row sm:items-center">
              <div className={`grid h-18 w-18 shrink-0 place-items-center rounded-lg ${user.quiz.date === new Date().toISOString().split("T")[0] ? "bg-emerald-50 dark:bg-emerald-950/30" : "bg-red-50 dark:bg-red-950/30"}`}>
                {user.quiz.date === new Date().toISOString().split("T")[0] ? (
                  <IoIosCheckmarkCircleOutline className="h-10 w-10 text-emerald-600" />
                ) : (
                  <MdOutlineCancel className="h-10 w-10 text-red-600" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                {user.quiz.date === new Date().toISOString().split("T")[0] ? (
                  <><h2 className="text-[2rem] font-semibold">Review complete</h2><p className="mt-1 text-[1.3rem] text-neutral-500">You&apos;ve completed today&apos;s vocabulary review.</p></>
                ) : (
                  <><h2 className="text-[2rem] font-semibold">Almost there</h2><p className="mt-1 text-[1.3rem] text-neutral-500">Review your words and give the quiz another try.</p></>
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
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-300 px-4 py-2.5 text-[1.3rem] font-semibold hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
              >
                <IoReload className="h-7 w-7" /> Try again
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex h-full min-h-[26rem] flex-col items-center justify-center px-6 text-center">
          <span className="mb-5 grid h-20 w-20 place-items-center rounded-full bg-neutral-100 dark:bg-neutral-800"><CiLock className="h-9 w-9 text-neutral-500" /></span>
          <h2 className="text-[2rem] font-semibold">Daily review is locked</h2>
          <p className="mt-2 max-w-[38rem] text-[1.35rem] text-neutral-500">Learn at least 10 words to unlock a five-question vocabulary review.</p>
        </div>
      )}
    </section>
  );
}

export default DailyQuiz;
