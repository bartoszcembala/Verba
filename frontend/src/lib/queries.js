import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

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

export function useLogin() {
  const mutation = useMutation({
    mutationFn: async (userInformations) => {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(userInformations),
      });
      
      const responseReady = await res.json();
      return responseReady.data.user;
    },
  });

  return {
    login: mutation.mutateAsync,
  };
}

export function useLogout() {
  const { mutate } = useMutation({
    mutationFn: async () => {
      const res = await fetch("http://localhost:5000/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      return await res.json();
    },
  });

  return {
    logout: mutate,
  };
}
