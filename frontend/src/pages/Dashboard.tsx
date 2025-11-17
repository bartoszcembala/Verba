import { useContext, useState } from "react";
import { SettingsContext } from "../lib/contexts";
import { useAddLesson } from "../lib/queries/lessonsQueries";
import { useEditModules, useModules } from "../lib/queries/modulesQueries";
import { useUsers } from "../lib/queries/userQueries";
import { Module, User } from "../types";

function Dashboard() {
  const [action, setAction] = useState("");
  const [selectedModule, setSelectedModule] = useState<Module>();
  const [input, setInput] = useState("");

  const { authorized } = useContext(SettingsContext)!;
  const { users } = useUsers();
  const { modules } = useModules();
  const { editModules } = useEditModules();
  const { addLesson } = useAddLesson();

  function handleModuleSelection(moduleId: string) {
    const module = modules?.find((mod: Module) => mod._id === moduleId);
    if (module) {
      setSelectedModule(module);
      setInput(module.words.flat().join(" * "));
    }
  }

  function handleAddLesson() {
    addLesson(
      { title: "Main lesson", html: input },
      {
        onSuccess: (data: any) => {
          console.log(data);
        },
      }
    );
  }

  function handleSend() {
    const words = input.split(" * ");
    const result: [string, string][] = [];

    for (let i = 0; i < words.length; i += 2) {
      if (words[i + 1] !== undefined) {
        result.push([words[i], words[i + 1]]);
      }
    }

    if (selectedModule) {
      editModules({ id: selectedModule._id, change: { words: result } });
    }
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
              {users?.map((user: User) => (
                <div key={user._id}>
                  <p>
                    {user.name} | {user.email}
                  </p>
                  <hr />
                </div>
              ))}
            </div>
          )}

          {action === "editModules" && (
            <>
              <div>
                {modules?.map((module: Module) => (
                  <p
                    onClick={() => handleModuleSelection(module._id)}
                    key={module._id}
                    className="cursor-pointer"
                  >
                    {module.title}
                  </p>
                ))}
              </div>
              {selectedModule && (
                <div className="w-[120rem]">
                  <h2>Edit Module {selectedModule.title}</h2>
                  <form onSubmit={(e) => e.preventDefault()}>
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="w-full"
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
              <h2>Add Lesson</h2>
              <form onSubmit={(e) => e.preventDefault()}>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full"
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
