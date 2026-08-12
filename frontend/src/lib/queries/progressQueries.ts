import { useQuery } from "@tanstack/react-query";
import { apiUrl } from "../api";
import type { Progress } from "../../types";

export function useProgress() {
  const { data, isLoading } = useQuery<Progress[]>({
    queryKey: ["progress"],
    queryFn: async () => {
      const response = await fetch(apiUrl("/progress/me"), {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Unable to load progress");
      const json = await response.json();
      return json.data as Progress[];
    },
  });

  return { progress: data, isLoadingProgress: isLoading };
}
