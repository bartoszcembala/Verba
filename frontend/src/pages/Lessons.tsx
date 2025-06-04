import { Link } from "react-router-dom";
import { useLessons } from "../lib/queries/lessonsQueries";

interface Lesson {
  _id: string;
  title: string;
  html: string;
  relatedExercises: string[];
  __v: number;
}

function Lessons() {
  const { lessons } = useLessons();

  return (
    <div className="flex items-center justify-center ">
      <div className="flex flex-col items-center justify-center w-[80rem] gap-10">
        {lessons?.map((les: Lesson) => (
          <Link
            key={les._id}
            to={`/${les.title}`}
            className="w-full h-34 rounded-2xl flex items-center justify-center text-4xl text-white font-bold hover:bg-neutral-800 transition duration-200 border-1 border-solid border-neutral-400"
          >
            {les.title}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Lessons;
