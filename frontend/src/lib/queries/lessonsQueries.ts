import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { LessonInterface } from "../../types";




interface NewLessonInput {
  title: string;
  html: string;
}

export function useLessons() {
  const { data, isLoading } = useQuery<LessonInterface[]>({
    queryKey: ["lessons"],
    queryFn: async () => {
      const res = await fetch(`http://localhost:5000/api/lesson/`, {
        method: "GET",
        credentials: "include",
      });
      const json = await res.json();
      return json.data as LessonInterface[];
    },
  });

  return { lessons: data, isLoadingLessons: isLoading };
}

export function useAddLesson() {
  const mutation = useMutation<LessonInterface, Error, NewLessonInput>({
    mutationFn: async ({ title, html }) => {
      const res = await fetch(`http://localhost:5000/api/lesson/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, html }),
      });

      const json = await res.json();
      if (json.success === false) {
        throw new Error(json.message);
      }

      return json.data as LessonInterface;
    },
  });

  return {
    addLesson: mutation.mutateAsync,
  };
}
