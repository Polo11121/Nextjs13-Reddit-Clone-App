import { Dispatch, SetStateAction } from "react";
import { CommentVoteRequest, PostVoteRequest } from "@/lib/validators/vote";
import { VoteType } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useCustomToast } from "@/hooks/useCustomToast";
import { toast } from "@/hooks/useToast";
import axios, { AxiosError } from "axios";

interface useVoteProps {
  type: "POST" | "COMMENT";
  id: string;
  setVotesAmount: Dispatch<SetStateAction<number>>;
  setCurrentVote: Dispatch<SetStateAction<"UP" | "DOWN" | null | undefined>>;
  setToPrevVote: () => void;
  currentVote?: VoteType | null;
}

export const useVote = ({
  id,
  type,
  setVotesAmount,
  currentVote,
  setCurrentVote,
  setToPrevVote,
}: useVoteProps) => {
  const { loginToast } = useCustomToast();

  return useMutation({
    mutationFn: async (voteType: VoteType) => {
      if (type === "COMMENT") {
        const payload: CommentVoteRequest = {
          voteType,
          commentId: id,
        };

        await axios.patch("/api/subreddit/post/comment/vote", payload);
      }

      if (type === "POST") {
        const payload: PostVoteRequest = {
          voteType,
          postId: id,
        };

        await axios.patch("/api/subreddit/post/vote", payload);
      }
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
