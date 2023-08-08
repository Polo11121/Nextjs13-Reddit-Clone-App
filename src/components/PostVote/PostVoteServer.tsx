import { getAuthSession } from "@/lib/auth";
import { Post, Vote, VoteType } from "@prisma/client";
import { notFound } from "next/navigation";
import { PostVoteClient } from "@/components/PostVote/PostVoteClient";

interface PostVoteServerProps {
  postId: string;
  initialVotesAmount?: number;
  initialVote?: VoteType | null;
  getData?: () => Promise<(Post & { votes: Vote[] }) | null>;
}

export const PostVoteServer = async ({
  postId,
  initialVotesAmount,
  initialVote,
  getData,
}: PostVoteServerProps) => {
  const session = await getAuthSession();

  let _votesAmount = 0;
  let _currentVote: VoteType | null | undefined = null;

  if (getData) {
    const post = await getData();

    if (!post) {
      return notFound();
    }

    _votesAmount = post.votes.reduce(
      (acc, vote) => (vote.type === "UP" ? acc + 1 : acc - 1),
      0
    );
    _currentVote = post.votes.find(
      (vote) => vote.userId === session?.user.id
    )?.type;
  } else {
    _votesAmount = initialVotesAmount!;
    _currentVote = initialVote;
  }

  return (
    <PostVoteClient
      postId={postId}
      initialVoteAmount={_votesAmount}
      initialVote={_currentVote}
    />
  );
};
