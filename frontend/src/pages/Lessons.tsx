import { Link } from "react-router-dom";
import { useLessons } from "../lib/queries/lessonsQueries";
import { HiOutlinePlay } from "react-icons/hi2";

interface Lesson {
  _id: string;
  title: string;
  html: string;
  relatedExercises: string[];
  __v: number;
}

function Lessons() {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const { lessons } = useLessons();

  return (
    <div className="flex items-center justify-center ">
      <div className="flex flex-col  lg:grid lg:grid-cols-3 w-[95%] lg:w-[110rem] gap-4 lg:gap-10">
        {lessons &&
          lessons.map((les: Lesson, i: number) => (
            <Link
              key={les._id}
              to={`/${les.title}`}
              className="bg-white border-1 border-neutral-300  dark:border-none dark:bg-neutral-700/70 rounded-xl dark:hover:bg-neutral-700 hover:bg-neutral-200 transition-colors items-center flex gap-10 px-5"
            >
              <p className="text-6xl text-neutral-500 dark:text-neutral-400">
                #{i + 1}
              </p>
              <div className="w-full">
                <p className="text-4xl pb-1">
                  {les.title}{" "}
                  <span className="ml-2 bg-green-700 inline-block px-4  text-2xl rounded-lg">
                    A1
                  </span>
                </p>
                <p className=" text-2xl text-neutral-400">
                  {user.finishedLessons.includes(les._id) ? "1" : "0"}
                  /1
                </p>
              </div>
              <HiOutlinePlay className="text-indigo-500 w-30 h-30 -translate-x-4" />
            </Link>
          ))}
      </div>
    </div>
  );
}

export default Lessons;
