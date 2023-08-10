import { startTransition } from "react";
import { useCustomToast } from "@/hooks/useCustomToast";
import { toast } from "@/hooks/useToast";
import { SubscribeToSubredditRequest } from "@/lib/validators/subreddit";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";

interface useSubscribeProps {
  subredditName: string;
  action: "subscribe" | "unsubscribe";
}

export const useSubscribe = ({ subredditName, action }: useSubscribeProps) => {
  const { loginToast } = useCustomToast();
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: SubscribeToSubredditRequest) => {
      const { data } = await axios.post(`/api/subreddit/${action}`, payload);

      return data as string;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
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
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      return toast({
        title: action.charAt(0).toUpperCase() + action.slice(1),
        description: `You are now ${action} from r/${subredditName}.`,
        variant: "default",
      });
    },
  });
};
