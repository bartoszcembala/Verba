import { lazy, Suspense, useState } from "react";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from "./components/AppRoutes";

const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(() => import("@tanstack/react-query-devtools").then(({ ReactQueryDevtools }) => ({ default: ReactQueryDevtools })))
  : null;

function App() {
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

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <div className="min-h-screen bg-neutral-50 text-neutral-950 transition-colors dark:bg-neutral-950 dark:text-neutral-100">
        <AppRoutes />
      </div>
      {ReactQueryDevtools && (
        <Suspense fallback={null}>
          <ReactQueryDevtools initialIsOpen={false} />
        </Suspense>
      )}
    </QueryClientProvider>
  );
}

export default App;
