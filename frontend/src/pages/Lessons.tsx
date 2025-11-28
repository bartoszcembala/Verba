import { Link } from "react-router-dom";
import { useLessons } from "../lib/queries/lessonsQueries";
import { HiOutlinePlay } from "react-icons/hi2";
import { LessonInterface } from "../types";
import { useState } from "react";
import Spinner from "../components/Spinner";

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

  return (
    <div className="flex items-center justify-center ">
      <div className="w-[95%] lg:w-[110rem]">
        <div className="bg-gradient-to-b from-indigo-500/30  dark:to-[#171717] to-neutral-200 px-5 py-6 rounded-2xl mb-20">
          <span className="mr-8">Sort By:</span>
          <span
            className={`cursor-pointer px-2 py-1 rounded-2xl ${
              filter === "type" && "bg-indigo-300 text-neutral-800"
            } my-8 mr-5`}
            onClick={() => setFilter("type")}
          >
            Type
          </span>
          <span
            className={`cursor-pointer px-2 py-1 rounded-2xl  ${
              filter === "level" && "bg-indigo-300 text-neutral-800"
            } my-8`}
            onClick={() => setFilter("level")}
          >
            Level
          </span>
        </div>

        {lessons &&
          Object.entries(grouped).map(([key, les]) => (
            <>
              <div className=" text-5xl my-8 pl-10 uppercase">{key}</div>
              <div className="lg:grid lg:grid-cols-2  gap-4 lg:gap-10 pb-10">
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
                        {lesson.title}{" "}
                        <span className="ml-2 bg-green-700 inline-block px-4  text-2xl rounded-lg">
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
