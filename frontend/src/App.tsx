import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from "./components/AppRoutes";
import { SettingsContext } from "./lib/contexts";
import { data } from "react-router-dom";

interface User {
  _id: string;
  __v: number;
  name: string;
  email: string;
  password: string;
  latestActivity: string[][];
  streak: string[];
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [mode, setMode] = useState<"guest" | "user">("guest");
  const [id, setId] = useState<string | null>(null);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        experimental_prefetchInRender: true,
      },
    },
  });

  // Check authentication status on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const user = await fetch(
          `https://verba-ywgu.onrender.com/api/users/check`,
          {
            method: "GET",
            credentials: "include",
          }
        );
      } catch (error) {
        console.log("Not authorized");
      }
    }
    checkAuth();
  }, []);

  // Load user from localStorage if exists
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
        value={{ mode, setMode, authorized, setAuthorized, id, setId }}
      >
        <div className="text-neutral-800/90 bg-neutral-200 dark:bg-[#171717] dark:text-white  min-h-screen transition-colors">
          <AppRoutes />
        </div>
      </SettingsContext.Provider>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
