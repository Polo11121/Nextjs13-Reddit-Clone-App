import { startTransition } from "react";
import { useCustomToast } from "@/hooks/useCustomToast";
import { toast } from "@/hooks/useToast";
import { SubscribeToSubredditRequest } from "@/lib/validators/subreddit";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";

export const useUnsubscribeFromSubreddit = (subredditName: string) => {
  const { loginToast } = useCustomToast();
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: SubscribeToSubredditRequest) => {
      const { data } = await axios.post("/api/subreddit/unsubscribe", payload);

      return data as string;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return loginToast();
        }

        return toast({
          title: "An error occurred",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      return toast({
        title: "Unsubscribed",
        description: `You are now unsubscribed from r/${subredditName}.`,
        variant: "default",
      });
    },
  });
};
