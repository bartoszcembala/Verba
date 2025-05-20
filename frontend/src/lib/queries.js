import { useQuery } from "@tanstack/react-query";

export function useProgress() {
  const { data, isLoading } = useQuery({
    queryKey: ["progress"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/api/progress/", {
        method: "GET",
        credentials: "include",
      });
      const json = await res.json();
      return json.data;
    },
  });

  return {
    progress: data,
    isLoadingProgress: isLoading,
  };
}

export function useModules() {
  const { data, isLoading } = useQuery({
    queryKey: ["modules"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/api/modules/", {
        method: "GET",
        credentials: "include",
      });
      const json = await res.json();
      return json.data;
    },
  });

  return { modules: data, isLoadingModules: isLoading };
}

