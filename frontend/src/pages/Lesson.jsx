/* eslint-disable react/prop-types */
import { useContext, useEffect } from "react";
import { useActivity } from "../lib/queries";
import { SettingsContext } from "../lib/contexts";
import { Link, useHref } from "react-router-dom";

// eslint-disable-next-line react/prop-types
function Lesson({ html, lesson }) {
  const { addActivity } = useActivity();
  const { authorized } = useContext(SettingsContext);
  const user = JSON.parse(localStorage.getItem("user"));
  const lessonName = useHref().slice(1);

  useEffect(() => {
    const arrWithout = user.latestActivity.filter(
      (item) => item !== lessonName
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
        {lesson &&
          authorized &&
          lesson.relatedExercises.map((exercise) => (
            <Link key={exercise} to={`/${exercise}`} className="block">
              {exercise}
            </Link>
          ))}
      </div>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

export default Lesson;
