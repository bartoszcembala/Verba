import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

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

export function useAddProgress() {
  const mutation = useMutation({
    mutationFn: async (progress) => {
      const res = await fetch("http://localhost:5000/api/progress/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(progress),
      });
      const json = await res.json();

      if (json.success === false) {
        throw new Error(json.message);
      }

      return json.data;
    },
  });

  return {
    addProgress: mutation.mutateAsync,
  };
}

export function useEditModules() {
  const mutation = useMutation({
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

      return json.data;
    },
  });
  return {
    editModules: mutation.mutateAsync,
  };
}

export function useAddLearnedWord() {
  const mutation = useMutation({
    mutationFn: async ({ id, word }) => {
      const res = await fetch(`http://localhost:5000/api/progress/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(word),
      });

      const json = await res.json();
      if (json.success === false) {
        throw new Error(json.message);
      }

      return json.data;
    },
  });
  return {
    addLearnedWord: mutation.mutateAsync,
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

export function useUsers() {
  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/api/users/", {
        method: "GET",
        credentials: "include",
      });
      const json = await res.json();
      return json.data;
    },
  });

  return { users: data, isLoadingUsers: isLoading };
}

export function useActivity() {
  const { mutateAsync } = useMutation({
    mutationFn: async ({ id, activities }) => {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ latestActivity: activities }),
      });

      const json = await res.json();
      if (json.success === false) {
        throw new Error(json.message);
      }

      return json.data;
    },
  });

  return {
    addActivity: mutateAsync,
  };
}

export function useLessons() {
  const { data, isLoading } = useQuery({
    queryKey: ["lessons"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/api/lesson/", {
        method: "GET",
        credentials: "include",
      });
      const json = await res.json();
      return json.data;
    },
  });

  return { lessons: data, isLoadingLessons: isLoading };
}

export function useAddLesson() {
  const mutation = useMutation({
    mutationFn: async ({ title, html }) => {
      const res = await fetch("http://localhost:5000/api/lesson/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, html }),
      });

      const json = await res.json();
      if (json.success === false) {
        throw new Error(json.message);
      }

      return json.data;
    },
  });

  return {
    addLesson: mutation.mutateAsync,
  };
}

export function useEditUser() {
  const { mutateAsync } = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await axios.patch(
        `http://localhost:5000/api/users/${id}`,
        data,
        {
          withCredentials: true,
        }
      );

      return res.data;
    },
  });

  return { editUser: mutateAsync };
}
