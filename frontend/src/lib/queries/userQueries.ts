import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

interface User {
  _id: string;
  __v: number;
  name: string;
  email: string;
  password: string;
  latestActivity: string[];
  streak: string[];
}

interface LoginInput {
  email: string;
  password: string;
}

interface ActivityInput {
  id: string;
  activities: string[];
}

interface EditUserInput {
  id: string;
  data: Partial<User>;
}

export function useLogin() {
  const mutation = useMutation<User, Error, LoginInput>({
    mutationFn: async (userInformations) => {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(userInformations),
      });

      const responseReady = await res.json();
      return responseReady.data.user as User;
    },
  });

  return {
    login: mutation.mutateAsync,
  };
}

export function useLogout() {
  const { mutate } = useMutation<unknown, Error, void>({
    mutationFn: async () => {
      const res = await fetch("http://localhost:5000/api/users/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
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
      const res = await fetch("http://localhost:5000/api/users/", {
        method: "GET",
        credentials: "include",
      });
      const json = await res.json();
      return json.data as User[];
    },
  });

  return { users: data, isLoadingUsers: isLoading };
}

export function useActivity() {
  const { mutateAsync } = useMutation<User, Error, ActivityInput>({
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

      return json.data as User;
    },
  });

  return {
    addActivity: mutateAsync,
  };
}

export function useEditUser() {
  const { mutateAsync } = useMutation<User, Error, EditUserInput>({
    mutationFn: async ({ id, data }) => {
      const res = await axios.patch<User>(
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
