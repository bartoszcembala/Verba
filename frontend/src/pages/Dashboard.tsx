import { useState } from "react";
import { useAddLesson } from "../lib/queries/lessonsQueries";
import { useEditModules, useModules } from "../lib/queries/modulesQueries";
import { useCurrentUser, useUsers } from "../lib/queries/userQueries";
import { Module, User } from "../types";

function Dashboard() {
  const [action, setAction] = useState("");
  const [selectedModule, setSelectedModule] = useState<Module>();
  const [input, setInput] = useState("");

  const { user: currentUser } = useCurrentUser();
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
      { title: "Main lesson", number: 1, displayTitle: "Main lesson", html: input },
      
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
    <div className="mx-auto max-w-[120rem]">
      {currentUser ? (
        <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
          <nav className="space-y-1 rounded-xl border border-neutral-200 bg-white p-3 self-start dark:border-neutral-800 dark:bg-neutral-900">
            <p onClick={() => setAction("")} className="cursor-pointer rounded-lg px-3 py-2 text-[1.35rem] hover:bg-neutral-100 dark:hover:bg-neutral-800">
              Home
            </p>
            <p
              onClick={() => setAction("addLesson")}
              className="cursor-pointer rounded-lg px-3 py-2 text-[1.35rem] hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              Add Lesson
            </p>
            <p
              onClick={() => setAction("editModules")}
              className="cursor-pointer rounded-lg px-3 py-2 text-[1.35rem] hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              Edit Module
            </p>
          </nav>

          {action === "" && (
            <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
              <h1 className="mb-5 text-[2.4rem] font-semibold">Users</h1>
              {users?.map((user: User) => (
                <div key={user._id} className="border-t border-neutral-100 py-3 first:border-0 dark:border-neutral-800">
                  <p className="text-[1.35rem]">
                    {user.name} | {user.email}
                  </p>
                </div>
              ))}
            </div>
          )}

          {action === "editModules" && (
            <>
              <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                {modules?.map((module: Module) => (
                  <p
                    onClick={() => handleModuleSelection(module._id)}
                    key={module._id}
                    className="cursor-pointer rounded-md px-3 py-2 text-[1.3rem] hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    {module.title}
                  </p>
                ))}
              </div>
              {selectedModule && (
                <div className="min-w-0 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
                  <h2 className="mb-5 text-[2rem] font-semibold">Edit module: {selectedModule.title}</h2>
                  <form onSubmit={(e) => e.preventDefault()}>
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="min-h-[30rem] w-full rounded-lg border border-neutral-300 bg-transparent p-4 text-[1.35rem] dark:border-neutral-700"
                      style={{ minHeight: "30rem" }}
                    />
                    <input className="mt-4 cursor-pointer rounded-lg bg-indigo-600 px-5 py-3 text-[1.35rem] font-semibold text-white" type="submit" value="Save module" onClick={handleSend} />
                  </form>
                </div>
              )}
            </>
          )}

          {action === "addLesson" && (
            <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
              <h2 className="mb-5 text-[2rem] font-semibold">Add lesson</h2>
              <form onSubmit={(e) => e.preventDefault()}>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[30rem] w-full rounded-lg border border-neutral-300 bg-transparent p-4 text-[1.35rem] dark:border-neutral-700"
                  style={{ minHeight: "30rem" }}
                />
                <input className="mt-4 cursor-pointer rounded-lg bg-indigo-600 px-5 py-3 text-[1.35rem] font-semibold text-white" type="submit" value="Add lesson" onClick={handleAddLesson} />
              </form>
            </div>
          )}
        </div>
      ) : (
        <div className="py-24 text-center text-[1.5rem] text-neutral-500">This route is protected.</div>
      )}
    </div>
  );
}

export default Dashboard;
