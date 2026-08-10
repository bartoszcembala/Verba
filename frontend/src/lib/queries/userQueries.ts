import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "../../types";
import { apiUrl } from "../api";

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

interface LoginInput {
  email: string;
  password: string;
}

interface ActivityInput {
  activities: string[][];
}

interface EditUserInput {
  data: Partial<User>;
}

export async function getCurrentUser(): Promise<User | null> {
  const response = await fetch(apiUrl("/users/me"), {
    method: "GET",
    credentials: "include",
  });

  if (response.status === 401) return null;
  if (!response.ok) throw new Error("Unable to load current user");

  const body = await response.json() as ApiResponse<User>;
  return body.data;
}

export function useCurrentUser() {
  const query = useQuery<User | null>({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    retry: false,
  });

  return { user: query.data, isLoadingUser: query.isLoading };
}

export function useLogin() {
  const mutation = useMutation<User, Error, LoginInput>({
    mutationFn: async (userInformations) => {
      const res = await fetch(
        apiUrl("/users/login"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(userInformations),
        },
      );

      if (!res.ok) throw new Error("Invalid email or password");

      const responseReady = await res.json();
      return responseReady.data.user as User;
    },
  });

  return {
    login: mutation.mutateAsync,
    isLogging: mutation.isPending,
  };
}

export function useLogout() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation<unknown, Error, void>({
    mutationFn: async () => {
      await fetch(
        apiUrl("/users/logout"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );
    },
    onSuccess: () => {
      queryClient.setQueryData(["currentUser"], null);
    },
  });

  return {
    logout: mutate,
  };
}

export function useUsers() {
  const { data, isLoading } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch(apiUrl("/users/"), {
        method: "GET",
        credentials: "include",
      });
      const json = await res.json();
      return json.data as User[];
    },
  });

  return { users: data, isLoadingUsers: isLoading };
}

export function useUser(userId: string) {
  const { data, isLoading } = useQuery<User>({
    queryKey: ["user", userId],
    queryFn: async () => {
      const res = await fetch(
        apiUrl(`/users/${userId}`),
        {
          method: "GET",
          credentials: "include",
        },
      );
      const json = await res.json();
      return json.data as User;
    },
  });

  return { user: data, isLoadingUser: isLoading };
}

export function useActivity() {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation<User, Error, ActivityInput>({
    mutationFn: async ({ activities }) => {
      const res = await fetch(
        apiUrl("/users/me"),
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ latestActivity: activities }),
        },
      );

      const json = await res.json();
      if (json.success === false) {
        throw new Error(json.message);
      }

      return json.data as User;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["currentUser"], user);
    },
  });

  return {
    addActivity: mutateAsync,
  };
}

export function useEditUser() {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation<User, Error, EditUserInput>({
    mutationFn: async ({ data }) => {
      const response = await fetch(apiUrl("/users/me"), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      const body = await response.json() as ApiResponse<User>;
      if (!response.ok) throw new Error(body.message || "Unable to update user");
      return body.data;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["currentUser"], user);
      localStorage.setItem("user", JSON.stringify(user));
    },
    onError: (error) => {
      console.error("❌ Błąd edycji użytkownika:", error.message);
    },
  });

  return { editUser: mutateAsync };
}
