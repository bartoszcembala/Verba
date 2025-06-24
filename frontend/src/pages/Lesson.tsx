import { useContext, useEffect } from "react";
import { useActivity, useEditUser } from "../lib/queries/userQueries";
import { SettingsContext } from "../lib/contexts";
import { Link, useLocation } from "react-router-dom";
import { useUpdateDailyQuests } from "../lib/useUpdateDailyQuests";

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
    } else {
      editUser({
        id: user._id,
        data: { finishedLessons: [...user.finishedLessons, lesson._id] },
      });
      handleUpdateDailyQuest("finish lesson");
    }
  }

  return (
    <div className="grid grid-cols-[1fr_3fr_1fr] p-4 gap-20 text-white relative">
      <div>
        Exercises for this topic:
        {lesson.relatedExercises &&
          authorized &&
          lesson.relatedExercises.map((exercise) => (
            <Link key={exercise} to={`/${exercise}`} className="block">
              {exercise}
            </Link>
          ))}
      </div>
      <div dangerouslySetInnerHTML={{ __html: lesson.html }} />
      <button
        onClick={handleFinishLesson}
        className="bg-indigo-500 cursor-pointer rounded-xl px-4 py-2 absolute top-[3%] right-[10%]"
      >
        Finish Lesson
      </button>
    </div>
  );
}

export default Lesson;
