import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from "./components/AppRoutes";
import { SettingsContext } from "./lib/contexts";
import { getCurrentUser } from "./lib/queries/userQueries";

function App() {
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [mode, setMode] = useState<"guest" | "user">("guest");
  const [id, setId] = useState<string | null>(null);

  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
          experimental_prefetchInRender: true,
        },
      },
    }),
  );

  // Check authentication status on mount
  useEffect(() => {
    let active = true;

    async function restoreSession() {
      try {
        const user = await getCurrentUser();
        if (!active) return;

        queryClient.setQueryData(["currentUser"], user);
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
          setAuthorized(true);
          setMode("user");
          setId(user._id);
        } else {
          localStorage.removeItem("user");
          setAuthorized(false);
          setMode("guest");
          setId(null);
        }
      } catch {
        if (!active) return;
        localStorage.removeItem("user");
        setAuthorized(false);
        setMode("guest");
        setId(null);
      } finally {
        if (active) setAuthLoading(false);
      }
    }

    void restoreSession();
    return () => { active = false; };
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />

      <SettingsContext.Provider
        value={{ mode, setMode, authorized, setAuthorized, authLoading, id, setId }}
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
