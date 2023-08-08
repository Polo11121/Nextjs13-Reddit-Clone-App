import { useCustomToast } from "@/hooks/useCustomToast";
import { toast } from "@/hooks/useToast";
import { CreateSubredditRequest } from "@/lib/validators/subreddit";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";

export const useCreateSubreddit = () => {
  const { loginToast } = useCustomToast();
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: CreateSubredditRequest) => {
      const { data } = await axios.post("/api/subreddit", payload);

      return data as string;
    },
    onSuccess: (data) => {
      return router.push(`/r/${data}`);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          return toast({
            title: "Subreddit already exists",
            description: "Please choose another name.",
            variant: "destructive",
          });
        }
        if (error.response?.status === 422) {
          return toast({
            title: "Invalid subreddit name",
            description: "Please choose a name between 3 and 21 characters.",
            variant: "destructive",
          });
        }
        if (error.response?.status === 401) {
          return loginToast();
        }
      }

      return toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });
};
