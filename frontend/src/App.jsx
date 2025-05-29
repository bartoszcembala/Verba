import AccountContext from "./lib/AccountContext";
import { useState } from "react";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from "./components/AppRoutes";
import { SettingsContext, UserContext } from "./lib/contexts";
import { useDailyStudyTimer } from "./components/useDailyStudyTimer";

function App() {
  const seconds = useDailyStudyTimer();

  // const formatTime = (s) => {
  //   const min = Math.floor(s / 60);
  //   const sec = s % 60;
  //   return `${min}m ${sec}s`;
  // };
  // console.log(formatTime(seconds));

  const [user, setUser] = useState();
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
    setUser(JSON.parse(localStorage.getItem("user")));
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <UserContext.Provider value={{ user, setUser }}>
        <SettingsContext.Provider
          value={{ mode, setMode, authorized, setAuthorized }}
        >
          <AccountContext>
            <AppRoutes />
          </AccountContext>
        </SettingsContext.Provider>
      </UserContext.Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
