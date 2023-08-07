import { startTransition } from "react";
import { useCustomToast } from "@/hooks/useCustomToast";
import { toast } from "@/hooks/useToast";
import { SubscribeToSubredditPayload } from "@/lib/validators/subreddit";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";

export const useSubscribeToSubreddit = (subredditName: string) => {
  const { loginToast } = useCustomToast();
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: SubscribeToSubredditPayload) => {
      const { data } = await axios.post("/api/subreddit/subscribe", payload);

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
        title: "Subscribed",
        description: `You are now subscribed to r/${subredditName}.`,
        variant: "default",
      });
    },
  });
};
