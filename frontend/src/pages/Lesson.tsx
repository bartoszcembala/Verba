import { useContext, useEffect } from "react";
import { useActivity, useEditUser } from "../lib/queries/userQueries";
import { SettingsContext } from "../lib/contexts";
import { Link, useLocation } from "react-router-dom";
import { useUpdateDailyQuests } from "../lib/useUpdateDailyQuests";
import toast from "react-hot-toast";

interface Lesson {
  _id: string;
  title: string;
  html: string;
  relatedExercises: string[];
  __v: number;
}

function Lesson({ lesson }: { lesson: Lesson }) {
  const { handleUpdateDailyQuest } = useUpdateDailyQuests();
  const { addActivity } = useActivity();
  const { editUser } = useEditUser();

  const { authorized } = useContext(SettingsContext)!;
  const user = JSON.parse(localStorage.getItem("user")!);
  const lessonName = useLocation().pathname.slice(1);

  useEffect(() => {
    const arrWithout = user.latestActivity.filter(
      (item: string) => item !== lessonName
    );
    const readyArr = [...arrWithout, lessonName];

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
        data: { finishedLessons: filteredLessons },
      });
      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, finishedLessons: filteredLessons })
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
      handleUpdateDailyQuest("finish lesson");
    }
  }

  return (
    <div className="lg:grid lg:grid-cols-[1fr_3fr_1fr] p-4 flex flex-col gap-20 text-white relative">
      <div className="order-3 lg:order-2">
        Exercises for this topic:
        {lesson.relatedExercises &&
          authorized &&
          lesson.relatedExercises.map((exercise) => (
            <Link key={exercise} to={`/${exercise}`} className="block">
              {exercise}
            </Link>
          ))}
      </div>

      <div className="order-1 lg:order-2" dangerouslySetInnerHTML={{ __html: lesson.html }} />

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
