import { useEffect, useState } from "react";
import { LuCheck, LuCrown } from "react-icons/lu";
import { useSearchParams } from "react-router-dom";
import { apiUrl } from "../lib/api";
import { useCurrentUser } from "../lib/queries/userQueries";

function BuyPremium() {
  const { user, refetchUser } = useCurrentUser();
  const [searchParams] = useSearchParams();
  const [isStartingCheckout, setIsStartingCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const checkoutStatus = searchParams.get("checkout");

  useEffect(() => {
    if (checkoutStatus !== "success" || user?.premium) return;

    const interval = window.setInterval(() => {
      void refetchUser();
    }, 1500);
    const timeout = window.setTimeout(() => window.clearInterval(interval), 15000);

    void refetchUser();
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [checkoutStatus, refetchUser, user?.premium]);

  async function checkout() {
    if (!user) return;

    setCheckoutError("");
    setIsStartingCheckout(true);

    try {
      const response = await fetch(apiUrl("/checkout"), { credentials: "include" });
      const body = await response.json() as { session?: { url?: string }; message?: string };
      if (!response.ok || !body.session?.url) throw new Error(body.message || "Unable to start checkout");
      window.location.assign(body.session.url);
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "Unable to start checkout");
      setIsStartingCheckout(false);
    }
  }

  return (
    <div className="mx-auto max-w-[74rem]">
      <header className="mb-10 text-center">
        <LuCrown className="mx-auto mb-4 h-12 w-12 text-indigo-600" />
        <h1 className="text-[3.4rem] font-bold tracking-tight">Learn more with Premium</h1>
        <p className="mt-2 text-[1.5rem] text-neutral-500">One payment. Permanent access to the full vocabulary library.</p>
        {checkoutStatus === "success" && !user?.premium && <p className="mt-3 text-[1.3rem] font-medium text-indigo-600 dark:text-indigo-400">Payment received. Activating Premium…</p>}
        {checkoutStatus === "cancelled" && <p className="mt-3 text-[1.3rem] text-neutral-500">Checkout was cancelled. You have not been charged.</p>}
        {checkoutError && <p className="mt-3 text-[1.3rem] text-red-600 dark:text-red-400">{checkoutError}</p>}
      </header>
      <section className="grid overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 md:grid-cols-[1fr_26rem]">
        <div className="p-8">
          <h2 className="text-[2rem] font-semibold">What&apos;s included</h2>
          <ul className="mt-6 space-y-4 text-[1.5rem]">
            {["Extended vocabulary modules", "Premium Polish topic packs", "Permanent access with one payment"].map((item) => <li className="flex items-center gap-3" key={item}><LuCheck className="text-emerald-600" />{item}</li>)}
          </ul>
        </div>
        <div className="border-t border-neutral-200 bg-neutral-50 p-8 dark:border-neutral-800 dark:bg-neutral-950 md:border-l md:border-t-0">
          {user?.premium && <span className="mb-4 inline-block rounded-md bg-emerald-100 px-3 py-1 text-[1.2rem] font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Active subscription</span>}
          <p className="text-[1.25rem] text-neutral-500">One-time payment</p>
          <p className="my-2 text-[3.4rem] font-bold">$19.99</p>
          <button disabled={user?.premium || isStartingCheckout} onClick={checkout} className="mt-5 w-full cursor-pointer rounded-lg bg-indigo-600 px-5 py-3 text-[1.45rem] font-semibold text-white hover:bg-indigo-700 disabled:cursor-default disabled:bg-neutral-300 dark:disabled:bg-neutral-700">
            {user?.premium ? "Already active" : isStartingCheckout ? "Opening checkout…" : "Get Premium"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default BuyPremium;
