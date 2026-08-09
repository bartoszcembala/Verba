import { useState } from "react";
import { Link } from "react-router-dom";
import { calculatePercent } from "../lib/calculatePercent";
import { useModules } from "../lib/queries/modulesQueries";
import { useProgress } from "../lib/queries/progressQueries";
import { FaChevronDown, FaMagnifyingGlass } from "react-icons/fa6";
import { HiOutlineArrowRight } from "react-icons/hi2";
import { User } from "../types";
import Spinner from "../components/Spinner";

const categories = ["verbs", "nouns", "dom", "jedzenie", "rodzina"];
const premiumCategories = ["dom", "jedzenie", "rodzina"];

function Exercises() {
  const { modules, isLoadingModules } = useModules();
  const { progress, isLoadingProgress } = useProgress();
  const [show, setShow] = useState<string | null>(null);
  const storedUser = localStorage.getItem("user");
  const user: User | null = storedUser ? JSON.parse(storedUser) : null;
  const [searchTerm, setSearchTerm] = useState("");
  const filteredModules = modules?.filter((mod) => `${mod.title} ${mod.displayName}`.toLowerCase().includes(searchTerm.toLowerCase()));
  if (isLoadingModules || isLoadingProgress) return <Spinner />;

  const moduleRow = (mod: NonNullable<typeof modules>[number]) => {
    const learned = progress?.find((m) => m.moduleName === mod.title && m.userName === user?.email)?.learned.length || 0;
    const percent = calculatePercent(learned, mod.words.length);
    return <Link key={mod._id} to={`/${mod.title}`} className="group flex items-center gap-4 border-t border-neutral-100 px-1 py-4 first:border-0 dark:border-neutral-800">
      <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h3 className="truncate text-[1.5rem] font-medium">{mod.displayName}</h3><span className="rounded bg-neutral-100 px-2 py-0.5 text-[1.1rem] text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">{mod.level}</span></div><div className="mt-2 flex items-center gap-3"><div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800"><span className="block h-full bg-indigo-600" style={{ width: `${percent}%` }} /></div><span className="text-[1.2rem] text-neutral-500">{percent}%</span></div></div><HiOutlineArrowRight className="text-neutral-400 transition-transform group-hover:translate-x-1" />
    </Link>;
  };

  return (
    <div className="mx-auto max-w-[88rem]">
      <header className="mb-8"><h1 className="text-[3.4rem] font-bold tracking-tight">Practice</h1><p className="mt-2 text-[1.5rem] text-neutral-500">Choose a word set and build your recall.</p></header>
      <label className="mb-7 flex items-center gap-3 rounded-lg border border-neutral-300 bg-white px-4 dark:border-neutral-700 dark:bg-neutral-900">
        <FaMagnifyingGlass className="text-neutral-400" /><input placeholder="Search exercises" value={searchTerm} className="h-20 w-full bg-transparent text-[1.45rem]" onChange={(e) => setSearchTerm(e.currentTarget.value)} />
        {searchTerm && <button className="text-[1.25rem] text-neutral-500" onClick={() => setSearchTerm("")}>Clear</button>}
      </label>
      {searchTerm ? <div className="rounded-xl border border-neutral-200 bg-white px-5 dark:border-neutral-800 dark:bg-neutral-900">{filteredModules?.map(moduleRow)}</div> : <div className="space-y-3">
        {categories.map((category) => {
          const categoryModules = modules?.filter((mod) => mod.title.includes(category)) ?? [];
          const locked = premiumCategories.includes(category) && !user?.premium;
          return <section key={category} className={`rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 ${locked ? "opacity-60" : ""}`}>
            <button disabled={locked} className="flex w-full items-center justify-between gap-4 p-5 text-left disabled:cursor-not-allowed" onClick={() => setShow(show === category ? null : category)}>
              <div><h2 className="text-[1.7rem] font-semibold capitalize">{category}{premiumCategories.includes(category) && " 🇵🇱"}</h2><p className="mt-1 text-[1.2rem] text-neutral-500">{categoryModules.length} exercises{locked && " · Premium"}</p></div><FaChevronDown className={`text-neutral-400 transition-transform ${show === category ? "rotate-180" : ""}`} />
            </button>
            {show === category && <div className="border-t border-neutral-100 px-5 dark:border-neutral-800">{categoryModules.map(moduleRow)}</div>}
          </section>;
        })}
      </div>}
    </div>
  );
}

export default Exercises;
