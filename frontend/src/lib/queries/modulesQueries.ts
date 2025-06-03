import { useMutation, useQuery } from "@tanstack/react-query";

interface Module {
  _id: string;
  title: string;
  displayName: string;
  words: string[][];
  __v: number;
}

interface EditModuleInput {
  id: string;
  change: { words: string[][] };
}

export function useModules() {
  const { data, isLoading } = useQuery<Module[]>({
    queryKey: ["modules"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/api/modules/", {
        method: "GET",
        credentials: "include",
      });
      const json = await res.json();
      return json.data as Module[];
    },
  });

  return { modules: data, isLoadingModules: isLoading };
}

export function useEditModules() {
  const mutation = useMutation<Module, Error, EditModuleInput>({
    mutationFn: async ({ id, change }) => {
      const res = await fetch(`http://localhost:5000/api/modules/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(change),
      });

      const json = await res.json();
      if (json.success === false) {
        throw new Error(json.message);
      }

      return json.data as Module;
    },
  });

  return {
    editModules: mutation.mutateAsync,
  };
}
