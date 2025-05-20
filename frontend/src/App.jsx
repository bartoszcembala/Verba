import AccountContext from "./lib/AccountContext";
import { useState } from "react";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from "./components/AppRoutes";
import { SettingsContext } from "./lib/contexts";

function App() {
  const [modules, setModules] = useState([]);
  const [progress, setProgress] = useState([]);
  const [dbAccount, setDbAccount] = useState();
  const [authorized, setAuthorized] = useState(false);
  const [mode, setMode] = useState("guest");

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        experimental_prefetchInRender: true,
      },
    },
  });

  async function fetchModules() {
    const res = await fetch("http://localhost:5000/api/modules/", {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    setModules(data.data);
  }

  async function fetchProgress() {
    const res = await fetch("http://localhost:5000/api/progress/", {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    setProgress(data.data);
  }

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("http://localhost:5000/api/users/check", {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) {
          setAuthorized(true);
          setMode("user");
          const data = await res.json();
          console.log(data);
          setDbAccount(data);
        } else {
          toast(
            "You are in guest mode.\n To use all features and save your progress between devices, please log in.",
            {
              duration: 1000,
            }
          );
        }
      } catch (error) {
        console.log("Not loged in");
      }
    }
    checkAuth();
  }, []);

  useEffect(() => {
    if (authorized) {
      fetchModules();
      fetchProgress();
    }
  }, [authorized]);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <SettingsContext.Provider
        value={{ mode, setMode, authorized, setAuthorized }}
      >
        <AccountContext>
          <AppRoutes
            setMode={setMode}
            setDbAccount={setDbAccount}
            setAuthorized={setAuthorized}
            dbAccount={dbAccount}
            progress={progress}
            modules={modules}
            authorized={authorized}
            mode={mode}
            setProgress={setProgress}
            setModules={setModules}
          />
        </AccountContext>
      </SettingsContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
