import { useContext, useEffect } from "react";
import { useCurrentUser } from "../lib/queries/userQueries";
import { useProgression } from "../lib/queries/progressionQueries";
import { SettingsContext } from "../lib/contexts";
import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { LessonInterface } from "../types";

function Lesson({ lesson }: { lesson: LessonInterface }) {
  const { recordActivity, completeLesson, isUpdatingProgression } = useProgression();
  const { user } = useCurrentUser();
  const userId = user?._id;

  const { authorized } = useContext(SettingsContext)!;
  const lessonName = useLocation().pathname.slice(1);
  useEffect(() => {
    if (!userId) return;
    void recordActivity({ path: lessonName, label: lesson.displayTitle });
  }, [lesson.displayTitle, lessonName, recordActivity, userId]);

  async function handleFinishLesson() {
    if (!user || user.finishedLessons.includes(lesson._id)) return;
    try {
      await completeLesson(lesson._id);
      toast.success("Lesson Finished!");
    } catch {
      toast.error("Could not finish this lesson.");
    }
  }

  if (!user) return null;

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
        <button disabled={isUpdatingProgression || user.finishedLessons.includes(lesson._id)} onClick={handleFinishLesson} className={`w-full rounded-lg px-4 py-3 text-[1.4rem] font-semibold ${user.finishedLessons.includes(lesson._id) ? "cursor-default border border-neutral-300 text-neutral-500 dark:border-neutral-700" : "cursor-pointer bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"}`}>
          {user.finishedLessons.includes(lesson._id) ? "Lesson completed" : "Finish lesson"}
        </button>
      </aside>
    </div>
  );
}

export default Lesson;
