import { useCustomToast } from "@/hooks/useCustomToast";
import { toast } from "@/hooks/useToast";
import { CommentRequest } from "@/lib/validators/comment";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";

export const useCreateComment = (onSuccess: () => void) => {
  const { loginToast } = useCustomToast();
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: CommentRequest) => {
      const { data } = await axios.patch(
        "/api/subreddit/post/comment",
        payload
      );

      return data;
    },
    onSuccess: () => {
      onSuccess();
      router.refresh();
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
  });
};
