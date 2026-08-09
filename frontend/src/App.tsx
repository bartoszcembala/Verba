import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from "./components/AppRoutes";
import { SettingsContext } from "./lib/contexts";
import { apiUrl } from "./lib/api";

function App() {
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
        await fetch(
          apiUrl("/users/check"),
          {
            method: "GET",
            credentials: "include",
          }
        );
      } catch {
        console.log("Not authorized");
      }
    }
    checkAuth();
  }, []);

  // Load user from localStorage if exists
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setMode("user");
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />

      <SettingsContext.Provider
        value={{ mode, setMode, authorized, setAuthorized, id, setId }}
      >
        <div className="min-h-screen bg-neutral-50 text-neutral-950 transition-colors dark:bg-neutral-950 dark:text-neutral-100">
          <AppRoutes />
        </div>
      </SettingsContext.Provider>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
