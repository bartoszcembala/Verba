import { useContext, useState } from "react";
import { SettingsContext } from "../lib/contexts";
import {
  useAddLesson,
  useEditModules,
  useModules,
  useUsers,
} from "../lib/queries";

function Dashboard() {
  const [action, setAction] = useState("");
  const [selectedModule, setSelectedModule] = useState(null);
  const { users } = useUsers();
  const [input, setInput] = useState("");
  const { authorized } = useContext(SettingsContext);
  const { modules } = useModules();
  const { editModules } = useEditModules();
  const { addLesson } = useAddLesson();

  function handleModuleSelection(moduleId) {
    const module = modules.find((mod) => mod._id === moduleId);
    console.log(module.words);
    setSelectedModule(module);
    setInput(module.words);
  }

  function handleAddLesson() {
    addLesson(
      { title: "Main lesson", html: input },
      {
        onSuccess: (data) => {
          console.log(data);
        },
      }
    );
  }

  function handleSend() {
    const words = input.split("*");
    const result = [];

    for (let i = 0; i < words.length; i += 2) {
      result.push([words[i], words[i + 1]]);
    }
    editModules({ id: selectedModule._id, change: { words: result } });
    console.log(result);
  }

  return (
    <div>
      {authorized ? (
        <div className="flex gap-40">
          <div>
            <p onClick={() => setAction("")} className="cursor-pointer">
              Home
            </p>
            <p
              onClick={() => setAction("addLesson")}
              className="cursor-pointer"
            >
              Add Lesson
            </p>
            <p
              onClick={() => setAction("editModules")}
              className="cursor-pointer"
            >
              Edit Module
            </p>
          </div>
          {action === "" && (
            <div className="flex flex-col gap-6">
              {users?.map((user) => (
                <>
                  <p key={user._id}>
                    {user.name} | {user.email}
                  </p>
                  <hr />
                </>
              ))}
            </div>
          )}
          {action === "editModules" && (
            <>
              <div>
                {modules?.map((module) => (
                  <p
                    onClick={() => handleModuleSelection(module._id)}
                    key={module._id}
                  >
                    {module.title}
                  </p>
                ))}
              </div>
              {selectedModule && (
                <div className="w-[120rem]">
                  <h2>Edit Module {selectedModule?.title}</h2>
                  <form onSubmit={(e) => e.preventDefault()}>
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="w-full h-50"
                      style={{ minHeight: "30rem" }}
                    />
                    <input type="submit" onClick={handleSend} />
                  </form>
                </div>
              )}
            </>
          )}
          {action === "addLesson" && (
            <div className="w-[120rem]">
              <h2>Add Lesson </h2>
              <form onSubmit={(e) => e.preventDefault()}>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full h-50"
                  style={{ minHeight: "30rem" }}
                />
                <input type="submit" onClick={handleAddLesson} />
              </form>
            </div>
          )}
        </div>
      ) : (
        <div>route protected 🔐</div>
      )}
    </div>
  );
}

export default Dashboard;
