import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Progress {
  _id: string;
  userName: string;
  moduleName: string;
  learned: string[];
  __v: number;
}

interface NewProgressInput {
  moduleName: string;
  userName: string;
  learned: string[];
}

interface LearnedWordInput {
  id: string;
  word: { learned: string[] };
}

interface EditProgressInput {
  id: string;
  data: unknown;
}

export function useProgress() {
  const { data, isLoading } = useQuery<Progress[]>({
    queryKey: ["progress"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/api/progress/", {
        method: "GET",
        credentials: "include",
      });
      const json = await res.json();
      return json.data as Progress[];
    },
  });

  return {
    progress: data,
    isLoadingProgress: isLoading,
  };
}

export function useAddProgress() {
  const mutation = useMutation<Progress, Error, NewProgressInput>({
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

      return json.data as Progress;
    },
  });

  return {
    addProgress: mutation.mutateAsync,
  };
}

export function useAddLearnedWord() {
  const mutation = useMutation<Progress, Error, LearnedWordInput>({
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

      return json.data as Progress;
    },
  });

  return {
    addLearnedWord: mutation.mutateAsync,
  };
}

export function useEditProgress() {
  const mutation = useMutation<Progress, Error, EditProgressInput>({
    mutationFn: async ({ id, data }) => {
      console.log("dat", id);
      const res = await axios.patch<Progress>(
        `http://localhost:5000/api/progress/${id}`,
        data,
        {
          withCredentials: true,
        }
      );

      return res.data;
    },
    onError: (error) => {
      console.error("❌ Błąd edycji progresu:", error.message);
    },
  });

  return { editProgress: mutation.mutateAsync };
}
