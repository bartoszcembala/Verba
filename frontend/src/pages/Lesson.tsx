import { useContext, useEffect } from "react";
import { useActivity } from "../lib/queries/userQueries";
import { SettingsContext } from "../lib/contexts";
import { Link, useLocation } from "react-router-dom";

interface Lesson {
  _id: string;
  title: string;
  html: string;
  relatedExercises: string[];
  __v: number;
}

function Lesson({ lesson }: { lesson: Lesson }) {
  console.log(lesson);
  const { addActivity } = useActivity();
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

  return (
    <div className="grid grid-cols-[1fr_3fr_1fr] p-4 gap-20">
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
    </div>
  );
}

export default Lesson;
