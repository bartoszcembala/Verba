import { useUsers } from "../lib/queries/userQueries";
import { BiSolidCrown } from "react-icons/bi";

export default function Leaderboard() {
  const { users } = useUsers();
  const sortedUsers = users?.sort((a, b) => b.exp - a.exp).slice(0, 10);
  const top3 = sortedUsers?.slice(0, 3);
  const rest = sortedUsers?.slice(3);

  console.log(sortedUsers);
  return (
    <div className="flex items-center justify-center">
      <div className="w-[50%] border-1 mt-18 border-indigo-500 shadow-[0_0_100px_rgba(99,102,241,0.2)] rounded-3xl px-10 pt-58 pb-10">
        <div className="grid  grid-cols-3 gap-10 ">
          {top3?.map((user, index) => (
            <div
              key={index}
              className={` h-60 bg-neutral-800  ${index === 1 ? "order-1" : ""}
        ${index === 0 ? "order-2 h-72 -translate-y-10" : ""}
        ${index === 2 ? "order-3" : ""}  text-center rounded-2xl  w-full`}
            >
              <div className="-translate-y-[34%]">
                <span className="shadow-[0_0_20px_rgba(99,102,241)]"></span>
                <BiSolidCrown
                  className={`mx-auto w-14 h-14 ${
                    index === 0 && "text-amber-300"
                  } ${index === 1 && "text-gray-200"} ${
                    index === 2 && "text-orange-400"
                  } `}
                />
                <img
                  src={`/avatars/AV${user.avatar}.png`}
                  className="w-36 h-36 mx-auto mb-8 border-2 shadow-[0_0_10px_rgba(99,102,241)] rounded-full border-indigo-500"
                />
                <p>{user.name}</p>
                <p
                  className={`${index === 0 && "text-amber-300"} ${
                    index === 2 && "text-orange-400"
                  } ${index === 1 && "text-gray-200"} font-bold text-5xl`}
                >
                  {Math.round(user.exp)} XP
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-4 ">
          {rest?.map((user, index) => (
            <p
              key={index}
              className="flex justify-center items-center bg-neutral-800 py-4 pr-8 rounded-2xl"
            >
              <p className="w-[10%] text-center">{index + 4}</p>
              <img
                src={`/avatars/AV${user.avatar}.png`}
                className="w-14 h-14 mr-4 rounded-full border-2 border-indigo-500"
              />
              <p className="w-[20%] text-left font-bold">{user.name}</p>
              <p className="w-[70%] text-end">{Math.round(user.exp)} XP</p>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
