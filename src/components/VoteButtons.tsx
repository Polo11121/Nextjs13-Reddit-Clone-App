"use client";

import { useEffect, useState } from "react";
import { VoteType } from "@prisma/client";
import { usePrevious } from "@mantine/hooks";
import { Button } from "@/components/ui/Button";
import { useVote } from "@/actions/useVote";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoteButtonsProps {
  type: "POST" | "COMMENT";
  id: string;
  initialVoteAmount: number;
  initialVote?: VoteType | null;
}

export const VoteButtons = ({
  type,
  id,
  initialVoteAmount,
  initialVote,
}: VoteButtonsProps) => {
  const [votesAmount, setVotesAmount] = useState(initialVoteAmount);
  const [currentVote, setCurrentVote] = useState(initialVote);
  const prevVote = usePrevious(currentVote);

  const setToPrevVote = () => setCurrentVote(prevVote);
  const { mutate: vote } = useVote({
    type,
    id,
    setVotesAmount,
    setCurrentVote,
    currentVote,
    setToPrevVote,
  });

  const voteUpHandler = () => vote("UP");
  const voteDownHandler = () => vote("DOWN");

  useEffect(() => {
    setCurrentVote(initialVote);
  }, [initialVote]);

  return (
    <>
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
    </>
  );
};
