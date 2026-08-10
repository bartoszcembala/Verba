import { useContext, useEffect, useMemo } from "react";
import { useActivity, useEditUser } from "../lib/queries/userQueries";
import { SettingsContext } from "../lib/contexts";
import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { LessonInterface, type User } from "../types";
import { useIncrementDailyQuest } from "../lib/queries/dailyQuestsQueries";

function Lesson({ lesson }: { lesson: LessonInterface }) {
  const { incrementDailyQuest } = useIncrementDailyQuest();
  const { addActivity } = useActivity();
  const { editUser } = useEditUser();

  const { authorized } = useContext(SettingsContext)!;
  const user = useMemo(
    () => JSON.parse(localStorage.getItem("user")!) as User,
    [],
  );
  const lessonName = useLocation().pathname.slice(1);
  useEffect(() => {
    const arrWithout = user.latestActivity.filter(
      (item) => item[0] !== lessonName,
    );
    const readyArr = [...arrWithout, [lessonName, lesson?.displayTitle]];

    while (readyArr.length > 3) {
      readyArr.shift();
    }

    addActivity({
      activities: readyArr,
    });

    localStorage.setItem(
      "user",
      JSON.stringify({ ...user, latestActivity: readyArr.reverse() }),
    );
  }, [addActivity, lesson.displayTitle, lessonName, user]);

  function handleFinishLesson() {
    if (user.finishedLessons.includes(lesson._id)) {
      const filteredLessons = user.finishedLessons.filter(
        (id: string) => id !== lesson._id,
      );
      editUser({
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
        }),
      );
    } else {
      editUser({
        data: { finishedLessons: [...user.finishedLessons, lesson._id] },
      });
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          finishedLessons: [...user.finishedLessons, lesson._id],
        }),
      );
      toast.success("Lesson Finished!");

      incrementDailyQuest({ index: 3, userId: user._id });
    }
  }

  return (
    <div className="mx-auto grid max-w-[108rem] gap-8 lg:grid-cols-[minmax(0,1fr)_25rem]">
      <article className="rounded-xl border border-neutral-200 bg-white px-7 py-8 text-[1.6rem] leading-relaxed dark:border-neutral-800 dark:bg-neutral-900 sm:px-12 sm:py-10 [&_h1]:mb-6 [&_h1]:text-[3rem] [&_h1]:font-bold [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:text-[2.2rem] [&_h2]:font-semibold [&_li]:ml-6 [&_li]:list-disc [&_p]:mb-4 [&_strong]:font-semibold" dangerouslySetInnerHTML={{ __html: lesson.html }} />
      <aside className="space-y-4 lg:sticky lg:top-36 lg:self-start">
        <section className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="text-[1.6rem] font-semibold">Practice this topic</h2>
          <div className="mt-3 space-y-2">
        {lesson.relatedExercises &&
          authorized &&
          lesson.relatedExercises.map((exercise) => (
            <Link key={exercise} to={`/${exercise}`} className="block rounded-lg bg-neutral-50 px-3 py-2 text-[1.35rem] text-indigo-600 hover:bg-neutral-100 dark:bg-neutral-800 dark:text-indigo-400">
              {exercise}
            </Link>
          ))}
          </div>
        </section>
        <button onClick={handleFinishLesson} className={`w-full cursor-pointer rounded-lg px-4 py-3 text-[1.4rem] font-semibold ${user.finishedLessons.includes(lesson._id) ? "border border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}>
          {user.finishedLessons.includes(lesson._id) ? "Mark as unfinished" : "Finish lesson"}
        </button>
      </aside>
    </div>
  );
}

export default Lesson;
