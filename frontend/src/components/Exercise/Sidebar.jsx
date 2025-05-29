/* eslint-disable react/prop-types */
import toast from "react-hot-toast";
import { btn } from "../../lib/styles";
import { useContext } from "react";
import { AccountCtx } from "../../lib/AccountContext";
import { SettingsContext } from "../../lib/contexts";
import { useProgress } from "../../lib/queries";

function Sidebar({
  verbs,
  selectedVerbs,
  setSelectedVerbs,
  setCorrect,
  module,
  user,
}) {
  const { mode } = useContext(SettingsContext);
  const { account, setAccount } = useContext(AccountCtx);
  const { progress } = useProgress();

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
    <div className="px-12">
      <div className="pb-12">
        <button className={btn} onClick={() => setSelectedVerbs(verbs)}>
          Add all
        </button>
        <button
          className={btn}
          onClick={() => setSelectedVerbs(account.notLearned[module])}
        >
          Add not learned
        </button>
        <button
          className={btn}
          onClick={() => {
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
                    .learned?.includes(verb[0])
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
    </div>
  );
}

export default Sidebar;
