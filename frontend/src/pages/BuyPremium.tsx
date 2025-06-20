import axios from "axios";
import Stripe from "stripe";
import { User } from "../types";
import { useGetDailyQuests } from "../lib/queries/dailyQuestsQueries";

function BuyPremium() {
  const stripe = new Stripe(
    "pk_test_51RTgPpEJx6hC03kLGMknT3ZdbsKGAJMnorWceN3IznEW08U3UeqKmdZz8loyCxhFgH7WhapTyfhk3wi4TpiexxUn00dFtCGW8T"
  );

  const { dailyQuests } = useGetDailyQuests();
  const userJson = localStorage.getItem("user");
  const user: User | null = userJson ? JSON.parse(userJson) : null;

  async function checkout() {
    try {
      if (!user) return;

      const session = await axios(
        `http://localhost:5000/api/checkout/${user._id}`,
        {
          withCredentials: true,
        }
      );
      window.location = session.data.session.url;
    } catch (error) {
      console.log(error);
    }
  }

  function handleClick() {
    if (dailyQuests) {
      const hasTitle = Object.values(dailyQuests[0]).some(
        (value: any) => value?.title === "finish quiz"
      );
      console.log(hasTitle);
    }
  }

  return (
    <div className="flex justify-center items-center">
      <div className="dark:bg-neutral-700/70 rounded-xl w-[38rem] shadow-lg relative overflow-hidden">
        {" "}
        {user?.premium && (
          <div className="absolute top-[60%] -right-[14%] w-[50rem] rotate-15 bg-indigo-500 text-white text-4xl font-bold text-center py-3 shadow-lg text-shadow-lg z-10">
            SUBSKRYPCJA AKTYWNA
          </div>
        )}
        <div className="text-center py-8 bg-indigo-500 rounded-t-xl text-white">
          <h2 className="text-5xl mb-6">Premium</h2>
          <p className="text-xl bg-indigo-600 mb-3 inline-block px-2 py-1 rounded-lg">
            BILLED ONCE
          </p>
          <h3 className="text-7xl">$19.99</h3>
        </div>
        <div className="h-[36rem]">
          <p className="text-center py-16">✔ You will get absolutely nothing</p>
        </div>
        <button
          onClick={checkout}
          className="cursor-pointer py-3 px-6 rounded-lg mb-6 shadow-lg transition  hover:scale-104 hover:bg-indigo-400 bg-indigo-500  ml-[40%] text-white"
        >
          Join Now!
        </button>
      </div>
      <button onClick={handleClick}>Get</button>
    </div>
  );
}

export default BuyPremium;
