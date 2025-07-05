import AccountContext from "./lib/AccountContext";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from "./components/AppRoutes";
import { SettingsContext } from "./lib/contexts";

interface User {
  _id: string;
  __v: number;
  name: string;
  email: string;
  password: string;
  latestActivity: string[];
  streak: string[];
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [mode, setMode] = useState<"guest" | "user">("guest");

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        experimental_prefetchInRender: true,
      },
    },
  });

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("https://verba-production-3e8f.up.railway.app/api/users/check", {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) {
          setAuthorized(true);
          setMode("user");
        } else {
          toast(
            "You are in guest mode.\n To use all features and save your progress between devices, please log in.",
            {
              duration: 1000,
            }
          );
        }
      } catch (error) {
        console.log("Not logged in");
      }
    }
    checkAuth();
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setMode("user");
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />

      <SettingsContext.Provider
        value={{ mode, setMode, authorized, setAuthorized }}
      >
        <AccountContext>
          <div className="text-neutral-800/90 bg-neutral-200 dark:bg-[#171717] dark:text-white  min-h-screen transition-colors">
            <AppRoutes />
          </div>
        </AccountContext>
      </SettingsContext.Provider>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
