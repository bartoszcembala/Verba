import { calculatePercent } from "../lib/calculatePercent";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";
import { getPreviousDates } from "../lib/getPreviousDates";

import { useProgress } from "../lib/queries/progressQueries";
import { useModules } from "../lib/queries/modulesQueries";
import { User } from "../types";
import { LuCrown } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import { CiCirclePlus } from "react-icons/ci";
import { TbHandFingerRight } from "react-icons/tb";
import { FiMinusCircle } from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function Account() {
  const storedUser = localStorage.getItem("user");
  const user: User | null = storedUser ? JSON.parse(storedUser) : null;

  const { modules, isLoadingModules } = useModules();
  const { progress, isLoadingProgress } = useProgress();
  const previousDates = getPreviousDates(4);

  if (isLoadingModules || isLoadingProgress) {
    return <Spinner />;
  }

  const dates = user?.timeSpentLearning.map((d) => ({
    date: `${d.date.split("-")[2]}-${d.date.split("-")[1]}`,
    value: d.value,
  }));

  return (
    <div className="flex justify-center items-center ">
      <div className="w-[90rem] flex flex-col gap-8">
        {user ? (
          <>
            <div className="rounded-2xl bg-white border-1 dark:border-none border-neutral-300 dark:bg-neutral-700/70 py-14 px-20 relative">
              <div className="flex gap-20 items-center">
                <img
                  src="https://avatar.iran.liara.run/public/9"
                  className="w-30 h-30 rounded-full border-2 border-indigo-500"
                />
                <div>
                  <h1 className="text-8xl  pb-3">{user.name} </h1>{" "}
                  <Link
                    to="/buy-premium"
                    className="text-neutral-400 cursor-pointer"
                  >
                    {user.premium
                      ? "Premium user"
                      : "Get a premium membership!"}{" "}
                    <LuCrown className="inline-block text-indigo-500 -translate-y-0.5 ml-1" />
                  </Link>
                </div>
                <IoSettingsOutline className="absolute right-10 top-10 h-12 w-12 cursor-pointer" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div className="p-10 bg-white border-1 dark:border-none border-neutral-300 dark:bg-neutral-700/70 rounded-2xl flex flex-col items-center justify-center gap-4">
                <p>FINSHED LESSONS:</p>
                <p className="text-7xl">4</p>
              </div>
              <div className="p-10 bg-white border-1 dark:border-none border-neutral-300 dark:bg-neutral-700/70 rounded-2xl flex flex-col items-center justify-center gap-4">
                <p>WODS LEARNED:</p>
                <p className="text-7xl">238</p>
              </div>{" "}
              <div className="p-10 bg-white border-1 dark:border-none border-neutral-300 dark:bg-neutral-700/70 rounded-2xl flex flex-col items-center justify-center gap-4">
                <p>STREAK:</p>
                <p className="text-7xl">{user.streak.length} DAYS</p>
              </div>
            </div>

            <div className="w-full h-[26rem] flex items-center justify-center p-10 mx-auto bg-white border-1 border-neutral-300 dark:border-none dark:bg-neutral-700/70 rounded-2xl">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart width={730} height={250} data={dates}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#8a8a8a",
                      borderColor: "#797979",
                    }}
                    cursor={{ fill: "#474747" }}
                  />
                  <Bar dataKey="value" fill="#6366F1" />
                  <CartesianGrid strokeDasharray="0" stroke="#6365f17b" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-5 justify-center items-center gap-6">
              <div className="flex flex-col gap-4 justify-center items-center px-7 py-5 bg-white border-1 border-neutral-300 dark:border-none dark:bg-neutral-700/70 rounded-2xl h-[16rem] text-center relative">
                <div className="flex absolute top-5 justify-between w-[14rem]">
                  <TbHandFingerRight className="cursor-pointer" />
                  <FiMinusCircle className="cursor-pointer" />
                </div>
                <img
                  src="https://avatar.iran.liara.run/public/64"
                  alt="profile picture"
                  className="w-24 h-24 border-2 border-indigo-500 rounded-full"
                />
                <p>Emily Carter</p>
              </div>
              <div className="flex flex-col gap-4 justify-center items-center px-7 py-5 bg-white border-1 border-neutral-300 dark:border-none dark:bg-neutral-700/70 rounded-2xl text-center h-[16rem] relative">
                <div className="flex absolute top-5 justify-between w-[14rem]">
                  <TbHandFingerRight className="cursor-pointer" />
                  <FiMinusCircle className="cursor-pointer" />
                </div>
                <img
                  src="https://avatar.iran.liara.run/public/15"
                  alt="profile picture"
                  className="w-24 h-24 border-2 border-indigo-500 rounded-full"
                />
                <p>James Miller</p>
              </div>
              <div className="flex flex-col gap-4 justify-center items-center px-7 py-5 bg-white border-1 border-neutral-300 dark:border-none dark:bg-neutral-700/70 rounded-2xl text-center h-[16rem] relative">
                <div className="flex absolute top-5 justify-between w-[14rem] ">
                  <TbHandFingerRight className="cursor-pointer" />
                  <FiMinusCircle className="cursor-pointer" />
                </div>
                <img
                  src="https://avatar.iran.liara.run/public/52"
                  alt="profile picture"
                  className="w-24 h-24 border-2 border-indigo-500 rounded-full"
                />
                <p>Sophia Johnson</p>
              </div>
              <div className="flex flex-col gap-4 justify-center items-center px-7 py-5 bg-white border-1 border-neutral-300 dark:border-none dark:bg-neutral-700/70 rounded-2xl text-center h-[16rem] relative">
                <div className="flex absolute top-5 justify-between w-[14rem]">
                  <TbHandFingerRight className="cursor-pointer" />
                  <FiMinusCircle className="cursor-pointer" />
                </div>
                <img
                  src="https://avatar.iran.liara.run/public/18"
                  alt="profile picture"
                  className="w-24 h-24 border-2 border-indigo-500 rounded-full"
                />
                <p>Liam Anderson</p>
              </div>
              <div className="flex flex-col gap-4 justify-center items-center px-7 py-5 bg-white border-1 border-neutral-300 dark:border-none dark:bg-neutral-700/70 rounded-2xl text-center h-[16rem]">
                <CiCirclePlus className="w-24 h-24" />
                <p>Add friend</p>
              </div>
            </div>
          </>
        ) : (
          <div>Please log in</div>
        )}
        <Link to="/dashboard">
          <button className=" bg-white dark:bg-neutral-700/70 rounded-full px-4 py-2 fixed bottom-[5%] right-[12%] cursor-pointer">
            🔐
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Account;
