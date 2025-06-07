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
    <div className="flex items-center justify-center text-white">
      <div className="grid grid-cols-[2fr_5fr] w-[120rem] gap-20">
        <div className="flex flex-col text-5xl gap-10">
          <div className="flex flex-col justify-center items-center bg-neutral-700 rounded-3xl px-10 py-6 h-[28rem]">
            <img
              src="https://i.pinimg.com/736x/2f/15/f2/2f15f2e8c688b3120d3d26467b06330c.jpg"
              className="w-34 h-34 rounded-full border-2 border-neutral-300 mb-4"
            />
            <h1 className="text-5xl pt-5 mb-3">{user?.name}</h1>
            <p className="text-neutral-300 text-3xl">Welcome back!</p>
            <p className="text-neutral-200 text-3xl translate-y-9">
              level 8. <FaStar className="inline-block -translate-y-1" /> Master
              (1.1k exp)
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 bg-neutral-700 rounded-2xl px-5 py-9">
            {previousDates.map((date) => (
              <span key={date} className="h-20 w-20 text-center rounded-2xl">
                <span className="block text-4xl pb-4">
                  {user?.streak.includes(date) ? "🔥" : "⚫"}
                </span>
                <span className="block text-neutral-300 text-4xl">
                  {date.split("-")[2]}
                </span>
              </span>
            ))}
          </div>

          <div className="bg-neutral-700 rounded-2xl px-5 py-9 text-center">
            <p className=" text-4xl mb-4 text-neutral-100">
              This week you studied for:
            </p>
            <p className="text-5xl underline">{timeSpent} minutes!</p>{" "}
          </div>
        </div>
        <div className="flex flex-col gap-20">
          <Link
            to={`/${user?.latestActivity[0]}`}
            className="bg-neutral-700 rounded-3xl px-10 py-12 flex justify-between"
          >
            <div>
              <p className="text-5xl mb-4">Pick up where you left of: </p>
              <p className="text-4xl">{user?.latestActivity[0]}</p>{" "}
            </div>
            <HiOutlinePlay className="text-8xl" />
          </Link>

          <div className="bg-neutral-700 rounded-3xl px-10 py-8 h-[20rem] flex justify-center items-center gap-8">
            <div className="self-center py-12 pl-12 text-9xl h-full w-[30%] border-r-2 border-neutral-400 cursor-pointer">
              GO
            </div>
            <div className="w-[70%] text-5xl">
              Complete short daily quiz to get xp!
            </div>
          </div>

          <div className="bg-neutral-700 rounded-3xl px-10 py-8 h-[35rem]">
            <h3 className="text-4xl mb-5 pb-5 text-center border-b-2 border-neutral-400">
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
