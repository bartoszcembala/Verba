import { Link } from "react-router-dom";
import { useLessons } from "../lib/queries/lessonsQueries";
import { HiOutlinePlay } from "react-icons/hi2";
import { useState } from "react";

function Lessons() {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const { lessons, isLoadingLessons } = useLessons();
  const [filter, setFilter] = useState<"type" | "level">("level");

  const grouped = lessons?.reduce((acc, item) => {
    const key = item[filter]; // tu podajesz według czego grupujesz

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(item);
    return acc;
  }, {});

  if (isLoadingLessons) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-24 h-24 sm:w-36 sm:h-36 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
      </div>
    );
  }
  console.log(grouped);
  return (
    <div className="flex items-center justify-center ">
      <div className="w-[95%] lg:w-[110rem]">
        <div className="bg-gradient-to-b from-indigo-500/30  dark:to-[#171717] to-neutral-200 px-5 py-6 rounded-2xl mb-20">
          <span className="mr-8">Sort By:</span>
          <span
            className={`cursor-pointer px-2 py-1 rounded-2xl  ${
              filter === "level" && "bg-indigo-300 text-neutral-800"
            } my-8 mr-5`}
            onClick={() => setFilter("level")}
          >
            Level
          </span>
          <span
            className={`cursor-pointer px-2 py-1 rounded-2xl ${
              filter === "type" && "bg-indigo-300 text-neutral-800"
            } my-8 `}
            onClick={() => setFilter("type")}
          >
            Type
          </span>
        </div>

        {lessons &&
          Object.entries(grouped).map(([key, les]) => (
            <>
              <div className=" text-5xl my-8 pt-8 pl-10 capitalize border-t-1 dark:border-indigo-500 border-indigo-400">
                {key === "A" && filter === "level"
                  ? "Level A: Beginner"
                  : key === "B"
                    ? "Level B: Intermediate"
                    : key === "C"
                      ? "Level C: Advanced"
                      : key}
              </div>
              <div className="lg:grid lg:grid-cols-2  gap-4 lg:gap-10 pb-5">
                {les.map((lesson, i) => (
                  <Link
                    key={lesson._id}
                    to={`/${lesson.title}`}
                    className="bg-white border-1 border-neutral-300  dark:border-none dark:bg-neutral-700/70 rounded-xl dark:hover:bg-neutral-700 hover:bg-neutral-200 transition-colors items-center flex gap-10 px-5"
                  >
                    <p className="text-6xl text-neutral-500 dark:text-neutral-400">
                      #{i + 1}
                    </p>
                    <div className="w-full">
                      <p className="text-4xl pb-1">
                        {lesson.displayTitle}{" "}
                        <span
                          className={`ml-2 ${key === "A" && filter === "level" ? "bg-green-700" : key === "B" && filter === "level" ? "bg-yellow-600" : key === "C" && filter === "level" ? "bg-red-600" : ""} ${lesson.level === "A" ? "bg-green-700" : lesson.level === "B" ? "bg-yellow-600" : lesson.level === "C" ? "bg-red-600" : ""} inline-block px-4  text-2xl rounded-lg`}
                        >
                          {lesson.level}
                        </span>
                      </p>
                      <p className=" text-2xl text-neutral-400">
                        {user.finishedLessons.includes(lesson._id) ? "1" : "0"}
                        /1
                      </p>
                    </div>
                    <HiOutlinePlay className="text-indigo-500 w-30 h-30 -translate-x-4" />
                  </Link>
                ))}
              </div>
            </>
          ))}
      </div>
    </div>
  );
}

export default Lessons;
