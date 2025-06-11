import { Link } from "react-router-dom";
import { User } from "../types";
import { getPreviousDates } from "../lib/getPreviousDates";
import { HiOutlinePlay } from "react-icons/hi2";
import { FaFlagCheckered } from "react-icons/fa6";
import { IoMdTime } from "react-icons/io";
import { MdOutlineQuiz } from "react-icons/md";
import { IoBulbOutline } from "react-icons/io5";
import { FaStar } from "react-icons/fa";

function Home() {
  const previousDates = getPreviousDates(7);
  const storedUser = localStorage.getItem("user");
  const user: User | null = storedUser ? JSON.parse(storedUser) : null;
  const timeSpent = user?.timeSpentLearning
    .slice(-7)
    .reduce((sum, curr) => sum + curr.value, 0);

  return (
    <div className="flex items-center justify-center ">
      <div className="grid grid-cols-[2fr_5fr] w-[120rem] gap-20">
        <div className="flex flex-col text-5xl gap-10">
          <div className="flex flex-col justify-center items-center border-neutral-300  bg-white border-1 dark:border-none dark:bg-neutral-700/70 rounded-3xl px-10 py-6 h-[28rem] ">
            <img
              src="https://avatar.iran.liara.run/public/9"
              className="w-34 h-34 rounded-full border-2 border-indigo-500 mb-4"
            />
            <h1 className="text-5xl pt-5 mb-3">{user?.name}</h1>
            <p className="text-neutral-500 dark:text-neutral-300 text-3xl">
              Welcome back!
            </p>
            <p className="text-neutral-700 dark:text-neutral-200 text-3xl translate-y-9">
              level 8.{" "}
              <FaStar className="inline-block -translate-y-1 text-indigo-500" />{" "}
              Master (1.1k exp)
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 border-neutral-300  bg-white border-1 dark:border-none dark:bg-neutral-700/70 rounded-2xl px-5 py-9">
            {previousDates.map((date) => (
              <span key={date} className="h-20 w-20 text-center rounded-2xl">
                <span className="block text-4xl pb-4">
                  {user?.streak.includes(date) ? "🔥" : "⚫"}
                </span>
                <span className="block text-neutral-600 dark:text-neutral-300 text-4xl">
                  {date.split("-")[2]}
                </span>
              </span>
            ))}
          </div>

          <div className="bg-white border-1 dark:border-none border-neutral-300  dark:bg-neutral-700/70 rounded-2xl px-5 py-9 text-center">
            <p className=" text-4xl mb-4 dark:text-neutral-100">
              This week you studied for:
            </p>
            <p className="text-5xl underline">{timeSpent} minutes!</p>{" "}
          </div>
          {/* <div className="bg-neutral-700/70 rounded-2xl px-5 py-9 text-center hover:bg-neutral-700 transition-colors cursor-pointer flex flex-col items-center justify-center gap-4">
            <LuCrown className="w-38 h-38 text-indigo-500 " />
            <p className="italic ">Get a premium!</p>
          </div> */}
        </div>
        <div className="flex flex-col gap-18 ">
          <Link
            to={`/${user?.latestActivity[0]}`}
            className="bg-white border-1 border-neutral-300 dark:border-none dark:bg-neutral-700/70 rounded-3xl px-10 py-12 flex justify-between hover:bg-neutral-700 transition-colors"
          >
            <div>
              <p className="text-5xl mb-4">Pick up where you left of: </p>
              <p className="text-4xl">{user?.latestActivity[0]}</p>{" "}
            </div>
            <HiOutlinePlay className="text-8xl text-indigo-500" />
          </Link>

          <div className="bg-white border-neutral-300 border-1 dark:border-none dark:bg-neutral-700/70 rounded-3xl px-10 py-8 h-[20rem] flex justify-center items-center gap-8">
            <div className="self-center py-12 pl-12 text-9xl h-full w-[30%] border-r-2 border-neutral-400 cursor-pointer">
              GO
            </div>
            <div className="w-[70%] text-5xl">
              Complete short daily quiz to get xp!
            </div>
          </div>

          <div className="bg-white border-1 border-neutral-300 dark:border-none dark:bg-neutral-700/70 rounded-3xl px-10 py-8 h-[35rem] dark:border-2 dark:border-indigo-500">
            <h3 className="text-4xl mb-5 pb-5 text-center border-b-2 border-indigo-500 ">
              Daily Quests:
            </h3>
            <div className=" grid grid-cols-2 gap-y-10">
              <div className="flex flex-col justify-center items-center gap-3">
                <p>Complete one lesson</p>
                <FaFlagCheckered className="h-16 w-16" />
                <p>0/1 (0%)</p>
              </div>
              <div className="flex flex-col justify-center items-center gap-3">
                <p>Spent 10 minutes learning</p>
                <IoMdTime className="h-16 w-16" />
                <p>5/10 (50%)</p>
              </div>{" "}
              <div className="flex flex-col justify-center items-center gap-3">
                <p>Learn 5 new words</p>
                <IoBulbOutline className="h-16 w-16" />
                <p>2/5 (40%)</p>
              </div>
              <div className="flex flex-col justify-center items-center gap-3">
                <p>Finish Daily Quiz</p>
                <MdOutlineQuiz className="h-16 w-16" />
                <p>0/1 (0%)</p>
              </div>{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
