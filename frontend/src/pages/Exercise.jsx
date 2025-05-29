/* eslint-disable react/prop-types */
import { useContext, useEffect, useRef, useState } from "react";
import "../App.css";
import "../index.css";
import toast, { Toaster } from "react-hot-toast";
import { useHref } from "react-router-dom";
import { fetchExercise } from "../lib/fetchExercises";
import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";
import { AccountCtx } from "../lib/AccountContext";
import {
  calculatePercent,
  calculatePercentContext,
} from "../lib/calculatePercent";
import { shuffleArray } from "../lib/shuffle";
import { SettingsContext, UserContext } from "../lib/contexts";
import {
  useActivity,
  useAddLearnedWord,
  useAddProgress,
  useProgress,
} from "../lib/queries";
import { useQueryClient } from "@tanstack/react-query";
import Sidebar from "../components/Exercise/Sidebar";

function Exercise({ initVerbs }) {
  const { mode } = useContext(SettingsContext);
  const inputRef = useRef(null);
  const letters = ["á", "é", "í", "ó", "ú", "ñ"];
  const module = useHref().slice(1);
  const [exercise, setExercise] = useState({
    question: "",
    translation: "Tłumaczenie pytania",
    correctAnswer: "",
    options: ["opcja1", "opcja2", "opcja3", "opcja4"],
  });
  const [showTranslation, setShowTranslation] = useState(false);
  const [writing, setWriting] = useState(true);
  let verbs = [...initVerbs];
  const [selectedVerbs, setSelectedVerbs] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isCorrect, setIsCorrect] = useState("");
  const [exerciseType, setExerciseType] = useState("translate");
  const randomVerb =
    selectedVerbs[Math.floor(Math.random() * selectedVerbs.length)];
  const { account, setAccount } = useContext(AccountCtx);
  const user = JSON.parse(localStorage.getItem("user"));
  const { progress } = useProgress();
  const { addProgress } = useAddProgress();
  const queryClient = useQueryClient();
  const { addLearnedWord } = useAddLearnedWord();
  const activeProgress = progress?.find(
    (p) => p.moduleName === module && p.userName === user.email
  );
  const { setUser } = useContext(UserContext);
  const { addActivity } = useActivity();

  const [correct, setCorrect] = useState([
    {
      name: "correct",
      value:
        mode === "guest"
          ? JSON.parse(localStorage.getItem("account"))?.modulesPercent[
              module
            ] || account.modulesPercent[module]
          : activeProgress?.learned.length,
      color: "#34563c",
    },
    {
      name: "wrong",
      value:
        mode === "guest"
          ? JSON.parse(localStorage.getItem("account"))?.notLearned[module] ||
            account.notLearned[module]
          : initVerbs.length - activeProgress?.learned.length,
      color: "#563434",
    },
  ]);

  useEffect(() => {
    const arrWithout = user.latestActivity.filter((item) => item !== module);
    const readyArr = [...arrWithout, module];

    while (readyArr.length > 3) {
      readyArr.shift();
    }

    addActivity(
      {
        id: user._id,
        activities: readyArr,
      },
      {
        onSuccess: () => {
          console.log(readyArr);
        },
      }
    );
    localStorage.setItem(
      "user",
      JSON.stringify({ ...user, latestActivity: readyArr.reverse() })
    );
    setUser({ ...user, latestActivity: readyArr.reverse() });
  }, []);

  useEffect(() => {
    if (
      user &&
      mode === "user" &&
      progress &&
      !progress?.some((p) => p.moduleName === module)
    ) {
      const progressObj = {
        moduleName: module,
        userName: user.email,
        learned: [],
      };

      addProgress(progressObj, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["progress"] });
          toast.success("Progress added");
        },
        // onError: (err) => {
        //   console.error("Add progress error:", err);
        //   toast.error("Could not save progress.");
        // },
      });
    } else if (
      user &&
      mode === "user" &&
      progress?.some((p) => p.moduleName === module)
    ) {
      console.log("Jest");
    }
    setCorrect([
      {
        name: "correct",
        value:
          mode === "guest"
            ? JSON.parse(localStorage.getItem("account"))?.modulesPercent[
                module
              ] || account.modulesPercent[module]
            : activeProgress?.learned.length,
        color: "#34563c",
      },
      {
        name: "wrong",
        value:
          mode === "guest"
            ? JSON.parse(localStorage.getItem("account"))?.notLearned[module] ||
              account.notLearned[module]
            : initVerbs.length - activeProgress?.learned.length,
        color: "#563434",
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);

  // async function fetchVerbs() {
  //   const response = await fetch("https://api.openai.com/v1/chat/completions", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer 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`,
  //     },
  //     body: JSON.stringify({
  //       model: "gpt-3.5-turbo",
  //       temperature: 0.2,
  //       messages: [
  //         {
  //           role: "user",
  //           content: `wygeneruj 10 losowych slow hiszpanskich poziom A2 w formacie JSON: {
  //   "words": [tablica ze slowami]
  // }`,
  //         },
  //       ],
  //       max_tokens: 500,
  //     }),
  //   });
  //   const data = await response.json();
  //   const chatResponse = data.choices[0].message.content.trim();
  //   const verbs = JSON.parse(chatResponse);
  //   setVerbs(verbs.words);
  // }

  function getExerciseTranslate() {
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

  function getExerciseFill() {
    setInputValue("");
    setIsCorrect("");

    toast.promise(fetchExercise(randomVerb, setExercise), {
      loading: "Generating exercise...",
      success: <b>Exercise generated</b>,
      error: <b>Exercise could not be generated.</b>,
    });
  }

  // eslint-disable-next-line no-unused-vars
  async function handleAnswer(answer) {
    const activeProgress = progress.find(
      (p) => p.moduleName === module && p.userName === user.email
    );

    if (mode === "guest") {
      let newAccount;

      if (answer === exercise.correctAnswer) {
        toast.success("Brawo! Poprawna odpowiedź.");
        setIsCorrect("correct");

        newAccount = {
          ...account,
          modulesPercent: {
            ...account.modulesPercent,
            [module]: account.modulesPercent[module].includes(answer)
              ? [...account.modulesPercent[module]]
              : [...account.modulesPercent[module], answer],
          },
          notLearned: {
            ...account.notLearned,
            [module]: account.notLearned[module].filter((v) => v[0] !== answer),
          },
        };

        setAccount(newAccount);
        setCorrect((prev) => [
          {
            ...prev[0],
            value: prev[0].value.includes(answer)
              ? [...prev[0].value]
              : [...prev[0].value, answer],
          },
          { ...prev[1], value: prev[1].value.filter((v) => v[0] !== answer) },
        ]);
        setSelectedVerbs((prev) => prev.filter((v) => v[0] !== answer));
      } else {
        toast.error("Niestety, to nie jest poprawna odpowiedź.");
        setIsCorrect("wrong");

        const notLearnedExists = account.notLearned[module].some(
          ([word]) => word === exercise.correctAnswer
        );

        const updatedNotLearned = notLearnedExists
          ? [...account.notLearned[module]]
          : [
              ...account.notLearned[module],
              [exercise.correctAnswer, exercise.translation],
            ];

        newAccount = {
          ...account,
          modulesPercent: {
            ...account.modulesPercent,
            [module]: account.modulesPercent[module].filter(
              (v) => v !== exercise.correctAnswer
            ),
          },
          notLearned: {
            ...account.notLearned,
            [module]: updatedNotLearned,
          },
        };

        setAccount(newAccount);
        setCorrect((prev) => [
          {
            ...prev[0],
            value: prev[0].value.filter((v) => v !== exercise.correctAnswer),
          },
          {
            ...prev[1],
            value: prev[1].value.some(
              ([word]) => word === exercise.correctAnswer
            )
              ? [...prev[1].value]
              : [
                  ...prev[1].value,
                  [exercise.correctAnswer, exercise.translation],
                ],
          },
        ]);
      }

      localStorage.setItem("account", JSON.stringify(newAccount));
    } else if (mode === "user") {
      if (answer === exercise.correctAnswer) {
        if (!activeProgress.learned.includes(answer)) {
          addLearnedWord(
            {
              id: activeProgress._id,
              word: {
                learned: [...activeProgress.learned, answer],
              },
            },
            {
              onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["progress"] });
                toast.success("Progress updated!");
              },
            }
          );
        }

        toast.success("Brawo! Poprawna odpowiedź!");
        setIsCorrect("correct");
      } else {
        const filtered = activeProgress.learned.filter(
          (x) => x !== exercise.correctAnswer
        );
        addLearnedWord(
          {
            id: activeProgress._id,
            word: {
              learned: [...filtered],
            },
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["progress"] });
              toast.error("Progress updated!");
            },
          }
        );
        toast.error("Źle");
      }
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (isCorrect === "" || isCorrect === "wrong") {
        handleAnswer(inputValue);
      } else if (isCorrect === "correct") {
        getExerciseTranslate();
      }
    }
  }

  return (
    <>
      <Toaster />
      <div className="grid grid-cols-[3fr_6fr_3fr] gap-40">
        <Sidebar
          verbs={verbs}
          selectedVerbs={selectedVerbs}
          setSelectedVerbs={setSelectedVerbs}
          module={module}
          setCorrect={setCorrect}
          user={user}
        />
        <div className="flex flex-col items-center justify-center border-3 border-solid border-neutral-300 rounded-2xl py-10 px-10 h-[60rem]">
          {selectedVerbs.length === 0 ? (
            <p>Add words to start</p>
          ) : exercise.correctAnswer === "" ? (
            <button
              className="btn"
              onClick={
                exerciseType === "translate"
                  ? getExerciseTranslate
                  : getExerciseFill
              }
            >
              Get an exercise
            </button>
          ) : (
            <>
              <h2>
                {exercise.question}{" "}
                <span onClick={() => setShowTranslation(!showTranslation)}>
                  TRANSLATE
                </span>
              </h2>
              <p className="translation">
                {showTranslation && exercise.translation}
              </p>
              {writing ? (
                <div className="inputContainer">
                  <button
                    className="btn toggleBtn"
                    onClick={() => setWriting(false)}
                  >
                    🔠
                  </button>
                  <input
                    className="input"
                    type="text"
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your answer"
                  />
                  {isCorrect === "correct" || isCorrect === "wrong" ? (
                    <button
                      className="btn checkBtn"
                      onClick={
                        exerciseType === "translate"
                          ? getExerciseTranslate
                          : getExerciseFill
                      }
                    >
                      ➡
                    </button>
                  ) : (
                    <button
                      className="btn checkBtn"
                      onClick={() => handleAnswer(inputValue)}
                    >
                      Check answer
                    </button>
                  )}
                </div>
              ) : (
                <div className="answersContainer">
                  <button
                    className="btn toggleBtn"
                    onClick={() => setWriting(true)}
                  >
                    ✍
                  </button>
                  {exercise.options.map((answer) => (
                    <div
                      onClick={() => handleAnswer(answer)}
                      key={answer}
                      className="answer"
                    >
                      {answer}
                    </div>
                  ))}
                </div>
              )}
              <div className="lettersContainer">
                {letters.map((letter) => (
                  <span
                    key={letter}
                    onClick={() => {
                      setInputValue((prev) => prev + letter);
                      inputRef.current.focus();
                    }}
                    className="btn letterBtn"
                  >
                    {letter}
                  </span>
                ))}
              </div>
              <div className="buttons">
                {/* <button
          className="btn"
          onClick={() => setShowTranslation(!showTranslation)}
        >
          Translation {exercise.answer}
        </button> */}

                <button
                  className="btn"
                  onClick={
                    exerciseType === "translate"
                      ? getExerciseTranslate
                      : getExerciseFill
                  }
                >
                  Get an exercise
                </button>
              </div>{" "}
            </>
          )}
          <div className="mt-4">
            <button
              onClick={() => setExerciseType("translate")}
              className="btn"
            >
              Translate the Word
            </button>
            <button
              onClick={() => setExerciseType("fillblank")}
              className="btn"
            >
              Fill the Blank
            </button>
          </div>
        </div>
        <div className="">
          {correct[0].value !== 0 || correct[1].value !== 0 ? (
            <>
              <p>
                {mode === "guest" &&
                  calculatePercentContext(
                    correct[0].value.length,
                    correct[1].value.length
                  ) + "%"}
                {mode === "user" &&
                  calculatePercent(
                    activeProgress?.learned.length,
                    initVerbs.length
                  ) + "%"}
              </p>
              <PieChart width={150} height={200}>
                <Pie
                  data={correct}
                  name="name"
                  dataKey="value"
                  innerRadius={25}
                  animationDuration={1000}
                  animationBegin={0}
                >
                  {correct.map((entry) => (
                    <Cell
                      fill={entry.color}
                      stroke={entry.color}
                      key={entry.name}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  iconType="circle"
                  // layout="vertical"
                  // align="right"
                  // verticalAlign="middle"
                />
              </PieChart>
            </>
          ) : (
            <p>Answer to see chart</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Exercise;
