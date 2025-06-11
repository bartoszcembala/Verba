/* eslint-disable react/prop-types */
import toast from "react-hot-toast";
import { useContext } from "react";
import { AccountCtx } from "../../lib/AccountContext";
import { ExerciseContext } from "../../lib/contexts";
import {
  useEditProgress,
  useProgress,
} from "../../lib/queries/progressQueries";
import { FaArrowAltCircleDown } from "react-icons/fa";

function Sidebar({ setCorrect }) {
  const { mode, verbs, selectedVerbs, setSelectedVerbs, module, user } =
    useContext(ExerciseContext);

  const { account, setAccount } = useContext(AccountCtx);
  const { progress } = useProgress();
  const { editProgress } = useEditProgress();
  const activeProgress = progress?.find(
    (p) => p.moduleName === module && p.userName === user?.email
  );

  function addVerb(verb) {
    if (selectedVerbs.includes(verb)) {
      setSelectedVerbs((prevVerbs) => prevVerbs.filter((v) => v !== verb));
      toast.success("Czasownik usunięty.");
    } else {
      setSelectedVerbs((prevVerbs) => [...prevVerbs, verb]);
      toast.success("Czasownik dodany.");
    }
  }

  return (
    <div
      className="px-12  hidden lg:block overflow-y-auto h-[80vh] relative bg-neutral-700 rounded-3xl"
      style={{
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE i Edge
      }}
    >
      <div className="pb-12 flex gap-3">
        <button
          className="cursor-pointer hover:bg-neutral-700 transition-colors px-4 py-2 rounded-2xl"
          onClick={() => setSelectedVerbs(verbs)}
        >
          Add all
        </button>
        <button
          className="cursor-pointer hover:bg-neutral-700 transition-colors px-4 py-2 rounded-2xl"
          onClick={() => {
            mode === "guest"
              ? setSelectedVerbs(account.notLearned[module])
              : setSelectedVerbs(
                  verbs.filter(
                    (item) => !activeProgress?.learned.includes(item[0])
                  )
                );
          }}
        >
          Add not learned
        </button>
        <button
          className="cursor-pointer hover:bg-neutral-700 transition-colors px-4 py-2 rounded-2xl"
          onClick={() => {
            editProgress({ id: activeProgress._id, data: { learned: [] } });
            const acc = {
              ...account,
              modulesPercent: {
                ...account.modulesPercent,
                [module]: [],
              },
              notLearned: {
                ...account.notLearned,
                [module]: [...verbs],
              },
            };
            setCorrect((prev) => [
              { ...prev[0], value: [] },
              { ...prev[1], value: [...verbs] },
            ]);
            setAccount(acc);
            localStorage.setItem("account", JSON.stringify(acc));
          }}
        >
          Reset progress
        </button>
      </div>
      {verbs.length >= 1 ? (
        verbs.map((verb) => (
          <div key={verb[0]} className="verbs">
            <span>
              {mode === "guest"
                ? account.modulesPercent[module].includes(verb[0])
                  ? "🟩"
                  : "🟥"
                : progress
                    ?.find(
                      (p) =>
                        p.moduleName === module && p.userName === user.email
                    )
                    ?.learned?.includes(verb[0])
                ? "🟩"
                : "🟥"}
            </span>
            <span className="cursor-pointer">🔈</span>
            <p>{verb[0] + ` (${verb[1]})`}</p>
            <button className="btn" onClick={() => addVerb(verb)}>
              {selectedVerbs.some(([element]) => element === verb[0])
                ? "Delete"
                : "Add"}
            </button>
          </div>
        ))
      ) : (
        <div className="load">Loading</div>
      )}
      <FaArrowAltCircleDown
        className="fixed bottom-[4.8%] left-[11%] w-20 h-20"
        style={{ color: "rgb(0, 144, 103)" }}
      />
    </div>
  );
}

export default Sidebar;
