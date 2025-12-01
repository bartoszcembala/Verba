import { useContext, useEffect } from "react";
import { useActivity, useEditUser } from "../lib/queries/userQueries";
import { SettingsContext } from "../lib/contexts";
import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { LessonInterface } from "../types";

function Lesson({ lesson }: { lesson: LessonInterface }) {
  const { addActivity } = useActivity();
  const { editUser } = useEditUser();

  const { authorized } = useContext(SettingsContext)!;
  const user = JSON.parse(localStorage.getItem("user")!);
  const lessonName = useLocation().pathname.slice(1);
  console.log(lesson);
  useEffect(() => {
    const arrWithout = user.latestActivity.filter(
      (item: string) => item[0] !== lessonName
    );
    const readyArr = [...arrWithout, [lessonName, lesson?.displayTitle]];

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
  }, []);

  function handleFinishLesson() {
    if (user.finishedLessons.includes(lesson._id)) {
      const filteredLessons = user.finishedLessons.filter(
        (id: string) => id !== lesson._id
      );
      editUser({
        id: user._id,
        data: {
          finishedLessons: filteredLessons,
          exp: user.exp + 30 * (user.streak.length / 100 + 1),
        },
      });
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          finishedLessons: filteredLessons,
          exp: user.exp + 30 * (user.streak.length / 100 + 1),
        })
      );
    } else {
      editUser({
        id: user._id,
        data: { finishedLessons: [...user.finishedLessons, lesson._id] },
      });
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          finishedLessons: [...user.finishedLessons, lesson._id],
        })
      );
      toast.success("Lesson Finished!");
      async function handleAnswerC(index: number) {
        try {
          const res = await axios.patch(
            "https://verba-ywgu.onrender.com/api/daily-quests/increment",
            { index },
            { withCredentials: true }
          );
          console.log(res.data);
        } catch (error) {
          console.error(error);
        }
      }
      handleAnswerC(3);
    }
  }

  return (
    <div className="lg:grid lg:grid-cols-[1fr_3fr_1fr] p-4 flex flex-col gap-20 text-white relative">
      <div className="order-3 lg:order-2 ml-10">
        Exercises for this topic:
        {lesson.relatedExercises &&
          authorized &&
          lesson.relatedExercises.map((exercise) => (
            <Link key={exercise} to={`/${exercise}`} className="block">
              {exercise}
            </Link>
          ))}
      </div>

      <div
        className="order-1 lg:order-2 border-2 border-indigo-500 rounded-2xl px-20 py-10"
        dangerouslySetInnerHTML={{ __html: lesson.html }}
      />

      <button
        onClick={handleFinishLesson}
        className="order-3 lg:order-3 bg-indigo-500 cursor-pointer rounded-xl px-4 py-2 lg:absolute lg:top-[3%] lg:right-[10%] mt-auto"
      >
        {user.finishedLessons.includes(lesson._id)
          ? "Mark as unfinished"
          : "Finish Lesson"}
      </button>
    </div>
  );
}

export default Lesson;
