import { Link } from "react-router-dom";
import { useLessons } from "../lib/queries/lessonsQueries";
import { HiOutlinePlay } from "react-icons/hi2";
import { LessonInterface } from "../types";

function Lessons() {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const { lessons } = useLessons();
  const uniqueTopics = [...new Set(lessons?.map((item) => item.type))];

  console.log(uniqueTopics);
  return (
    <div className="flex items-center justify-center ">
      <div className="w-[95%] lg:w-[110rem]">
        {lessons &&
          uniqueTopics.map((topic) => (
            <>
              <div className=" text-6xl">{topic}</div>
              <div className="lg:grid lg:grid-cols-3  gap-4 lg:gap-10">
                {lessons.map(
                  (lesson) =>
                    lesson.type === topic && (
                      <div className="">{lesson.title}</div>
                    )
                )}
              </div>
              <hr />
            </>
          ))}
      </div>
    </div>
  );
}

export default Lessons;
