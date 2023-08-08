import { Dispatch, SetStateAction } from "react";
import { PostVoteRequest } from "@/lib/validators/vote";
import { VoteType } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useCustomToast } from "@/hooks/useCustomToast";
import { toast } from "@/hooks/useToast";
import axios, { AxiosError } from "axios";

interface useVotePostProps {
  postId: string;
  setVotesAmount: Dispatch<SetStateAction<number>>;
  setCurrentVote: Dispatch<SetStateAction<"UP" | "DOWN" | null | undefined>>;
  setToPrevVote: () => void;
  currentVote?: VoteType | null;
}

export const useVotePost = ({
  postId,
  setVotesAmount,
  currentVote,
  setCurrentVote,
  setToPrevVote,
}: useVotePostProps) => {
  const { loginToast } = useCustomToast();

  return useMutation({
    mutationFn: async (type: VoteType) => {
      const payload: PostVoteRequest = {
        voteType: type,
        postId,
      };

      await axios.patch("/api/subreddit/post/vote", payload);
    },
    onMutate: (voteType) => {
      if (currentVote === voteType) {
        setCurrentVote(null);

        if (voteType === "UP") {
          setVotesAmount((prev) => prev + 1);
        } else {
          setVotesAmount((prev) => prev - 1);
        }
      } else {
        setCurrentVote(voteType);

        if (voteType === "UP") {
          setVotesAmount((prev) => prev + (currentVote ? 2 : 1));
        } else {
          setVotesAmount((prev) => prev - (currentVote ? 2 : 1));
        }
      }
    },
    onError: (error, voteType) => {
      if (voteType === "UP") {
        setVotesAmount((prev) => prev - 1);
      } else {
        setVotesAmount((prev) => prev + 1);
      }

      setToPrevVote();

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
