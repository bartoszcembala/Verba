import { Link } from "react-router-dom";
import { useLessons } from "../lib/queries/lessonsQueries";
import { HiOutlineArrowRight } from "react-icons/hi2";
import { useState } from "react";
import Spinner from "../components/Spinner";

function Lessons() {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const { lessons, isLoadingLessons } = useLessons();
  const [filter, setFilter] = useState<"type" | "level">("level");
  const grouped = lessons?.reduce<Record<string, typeof lessons>>((acc, item) => {
    const key = item[filter];
    (acc[key] ||= []).push(item);
    return acc;
  }, {});

  if (isLoadingLessons) return <Spinner />;
  const levelLabel = (key: string) => filter !== "level" ? key : key === "A" ? "Beginner" : key === "B" ? "Intermediate" : key === "C" ? "Advanced" : key;
  const badgeClass = (level: string) => level === "A" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : level === "B" ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300";

  return (
    <div className="mx-auto max-w-[104rem]">
      <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div><h1 className="text-[3.4rem] font-bold tracking-tight">Lessons</h1><p className="mt-2 text-[1.5rem] text-neutral-500">Build your language skills one topic at a time.</p></div>
        <div className="flex rounded-lg border border-neutral-200 p-1 dark:border-neutral-800">
          {(["level", "type"] as const).map((option) => <button key={option} onClick={() => setFilter(option)} className={`rounded-md px-4 py-2 text-[1.3rem] font-medium capitalize ${filter === option ? "bg-neutral-100 dark:bg-neutral-800" : "text-neutral-500"}`}>{option}</button>)}
        </div>
      </header>
      <div className="space-y-10">
        {grouped && Object.entries(grouped).map(([key, group]) => (
          <section key={key}>
            <div className="mb-4 flex items-baseline justify-between"><h2 className="text-[2rem] font-semibold capitalize">{filter === "level" && `Level ${key}: `}{levelLabel(key)}</h2><span className="text-[1.25rem] text-neutral-500">{group?.length} lessons</span></div>
            <div className="grid gap-3 md:grid-cols-2">
              {group?.map((lesson, i) => {
                const finished = user?.finishedLessons?.includes(lesson._id);
                return <Link key={lesson._id} to={`/${lesson.title}`} className="group flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-5 hover:border-indigo-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-indigo-700">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-neutral-100 text-[1.3rem] font-semibold text-neutral-500 dark:bg-neutral-800">{i + 1}</span>
                  <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h3 className="truncate text-[1.55rem] font-semibold">{lesson.displayTitle}</h3><span className={`rounded px-2 py-0.5 text-[1.1rem] font-semibold ${badgeClass(lesson.level)}`}>{lesson.level}</span></div><p className="mt-1 text-[1.2rem] text-neutral-500">{finished ? "Completed" : "Not started"}</p></div>
                  <HiOutlineArrowRight className="text-neutral-400 transition-transform group-hover:translate-x-1" />
                </Link>;
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export default Lessons;
