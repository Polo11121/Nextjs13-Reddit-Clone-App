"use client";

import { useEffect, useState } from "react";
import { useCustomToast } from "@/hooks/useCustomToast";
import { VoteType } from "@prisma/client";
import { usePrevious } from "@mantine/hooks";
import { Button } from "@/components/ui/Button";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVotePost } from "@/actions/useVotePost";

interface PostVoteClientProps {
  postId: string;
  initialVoteAmount: number;
  initialVote?: VoteType | null;
}

export const PostVoteClient = ({
  postId,
  initialVoteAmount,
  initialVote,
}: PostVoteClientProps) => {
  const [votesAmount, setVotesAmount] = useState(initialVoteAmount);
  const [currentVote, setCurrentVote] = useState(initialVote);
  const prevVote = usePrevious(currentVote);

  const setToPrevVote = () => setCurrentVote(prevVote);
  const { mutate: vote } = useVotePost({
    postId,
    setVotesAmount,
    setCurrentVote,
    currentVote,
    setToPrevVote,
  });
  const { loginToast } = useCustomToast();

  const voteUpHandler = () => vote("UP");
  const voteDownHandler = () => vote("DOWN");

  useEffect(() => {
    setCurrentVote(initialVote);
  }, [initialVote]);

  return (
    <div className="flex sm:flex-col gap-4 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0">
      <Button
        onClick={voteUpHandler}
        size="sm"
        variant="ghost"
        aria-label="upvote"
      >
        <ArrowBigUp
          className={cn("h-5 w-5 text-zinc-700", {
            "text-emerald-500 fill-emerald-500": currentVote === "UP",
          })}
        />
      </Button>
      <p className="text-center py-2 font-medium text-sm text-zinc-900">
        {votesAmount}
      </p>
      <Button
        onClick={voteDownHandler}
        size="sm"
        variant="ghost"
        aria-label="downvote"
      >
        <ArrowBigDown
          className={cn("h-5 w-5 text-zinc-700", {
            "text-red-500 fill-red-500": currentVote === "DOWN",
          })}
        />
      </Button>
    </div>
  );
};
