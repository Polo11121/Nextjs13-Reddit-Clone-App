"use client";

import { useRef, useState } from "react";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { Comment, CommentVote, User, VoteType } from "@prisma/client";
import { formatTimeToNow } from "@/lib/utils";
import { VoteButtons } from "@/components/VoteButtons";
import { Button } from "@/components/ui/Button";
import { MessageSquare } from "lucide-react";
import { useSession } from "next-auth/react";
import { CreateComment } from "@/components/CreateComment";
import { useCustomToast } from "@/hooks/useCustomToast";

type ExtendedComment = Comment & {
  author: User;
  votes: CommentVote[];
};

interface PostCommentProps {
  comment: ExtendedComment;
  commentVotesAmount: number;
  initialVote?: VoteType;
  postId: string;
}

export const PostComment = ({
  comment,
  commentVotesAmount,
  initialVote,
  postId,
}: PostCommentProps) => {
  const [isReplaying, setIsReplaying] = useState(false);
  const commentRef = useRef<HTMLDivElement>(null);
  const { loginToast } = useCustomToast();
  const { data: session } = useSession();

  const replayHandler = () => {
    if (!session) {
      loginToast();
    } else {
      setIsReplaying(true);
    }
  };

  const closeReplayHandler = () => setIsReplaying(false);

  return (
    <div ref={commentRef} className="flex flex-col">
      <div className="flex items-center">
        <UserAvatar
          user={{
            name: comment.author.name || null,
            image: comment.author.image || null,
          }}
          className="h-6 w-6"
        />
        <div className="ml-2 flex items-center gap-x-2">
          <p className="text-sm font medium text-gray-900">
            u/{comment.author.username}
          </p>
          <p className="max-h-40 text-xs truncate text-zinc-500">
            {formatTimeToNow(new Date(comment.createdAt))}
          </p>
        </div>
      </div>
      <p className="text-sm text-zinc-900 mt-2">{comment.text}</p>
      <div className="flex gap-2 items-center flex-wrap">
        <VoteButtons
          type="COMMENT"
          id={comment.id}
          initialVoteAmount={commentVotesAmount}
          initialVote={initialVote}
        />
        <Button onClick={replayHandler} variant="ghost" size="xs">
          <MessageSquare className="w-4 h-4 mr-1.5" />
          Replay
        </Button>
        {isReplaying && (
          <CreateComment
            postId={postId}
            replyToId={comment.replyToId ?? comment.id}
            onCancel={closeReplayHandler}
          />
        )}
      </div>
    </div>
  );
};
