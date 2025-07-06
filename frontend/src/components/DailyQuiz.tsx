import { useEffect, useState } from "react";
import { useProgress } from "../lib/queries/progressQueries";
import { shuffleArray } from "../lib/shuffle";
import Spinner from "./Spinner";
import toast from "react-hot-toast";
import { useUpdateDailyQuests } from "../lib/useUpdateDailyQuests";
import { useEditUser } from "../lib/queries/userQueries";
import { IoReload } from "react-icons/io5";
import { CiLock } from "react-icons/ci";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineCancel } from "react-icons/md";

function DailyQuiz() {
  const { progress, isLoadingProgress } = useProgress();
  const { editUser } = useEditUser();
  const { handleUpdateDailyQuest } = useUpdateDailyQuests();
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const userProgress = progress?.filter(
    (progress) => progress.userName === user?.email
  );
  const [currQuestion, setCurrQuestion] = useState(0);
  let learnedWords = userProgress?.reduce<string[][]>(
    (acc, curr) => acc.concat(curr.learned),
    []
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
        toast.success("quiz completed");
        handleUpdateDailyQuest("finish quiz");
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
          })
        );
      }
    }
  }

  return (
    <div className="bg-white shadow-xs border-neutral-300 border-1 dark:border-none dark:bg-neutral-700/70 rounded-3xl px-10  h-[20rem] flex justify-center items-center gap-8 relative">
      {learnedWords && learnedWords?.length >= 10 ? (
        <div>
          {isLoadingProgress && <Spinner />}
          {currQuestion < 5 &&
          user.quiz.date !== new Date().toISOString().split("T")[0] ? (
            <>
              <div className="absolute top-10 right-30">
                <span className="text-green-300">{correct}</span> |{" "}
                <span className="text-red-300">{wrong}</span>
              </div>{" "}
              <div className="text-5xl text-center mb-10">
                {quizData[currQuestion]?.translation}
              </div>
              <div className="flex gap-5 w-[60%]">
                {quizData[currQuestion].answers.map((answer, i) => (
                  <div
                    onClick={() => handleSelect(answer)}
                    className="border-1 cursor-pointer px-2 py-1 rounded-lg w-full dark:hover:bg-neutral-700 hover:bg-neutral-200 transition border-neutral-400"
                    key={i}
                  >
                    {answer[0]}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center ">
              <div className="">
                {" "}
                {user.quiz.date === new Date().toISOString().split("T")[0] ? (
                  <IoIosCheckmarkCircleOutline className="w-50 h-50 mr-10  pr-10 border-r-2 border-indigo-500" />
                ) : (
                  <MdOutlineCancel className="w-50 h-50 mr-50  pr-10 border-r-2 border-indigo-500" />
                )}
              </div>
              <div className="text-5xl">
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
                      })
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
                className="absolute bottom-5 right-5 cursor-pointer"
              >
                <IoReload className="w-20 h-20 hover:rotate-250 transition duration-450" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex gap-10 items-center justify-center">
          <p className="text-5xl">Learn at least 10 words to unlock</p>
          <CiLock className="w-20 h-20" />
        </div>
      )}
    </div>
  );
}

export default DailyQuiz;
