import { useRef } from "react";
import { formatTimeToNow } from "@/lib/utils";
import { MessageSquare } from "lucide-react";
import { ExtendedPost } from "@/types/db";
import { EditorOutput } from "@/components/EditorOutput";
import { Vote } from "@prisma/client";
import { VoteButtons } from "@/components/VoteButtons";

type PartialVote = Pick<Vote, "type">;

interface PostProps {
  votesAmount: number;
  currentVote?: PartialVote | null;
  post: ExtendedPost;
}

export const Post = ({ post, currentVote, votesAmount }: PostProps) => {
  const pRef = useRef<HTMLDivElement>(null);

  const {
    id,
    title,
    createdAt,
    content,
    comments,
    subreddit: { name: subredditName },
    author: { username: authorName },
  } = post;

  return (
    <div className="rounded-md bg-white shadow">
      <div className="px-6 py-4 flex justify-between">
        <div className="flex sm:flex-col gap-4 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0">
          <VoteButtons
            id={id}
            initialVote={currentVote?.type}
            initialVoteAmount={votesAmount}
            type="POST"
          />
        </div>
        <div className="w-0 flex-1">
          <div className="max-h-40 mt-1 text-xs text-gray-500">
            {subredditName ? (
              <>
                <a
                  href={`/r/${subredditName}`}
                  className="underline text-zinc-900 text-sm underline-offset-2"
                >
                  r/{subredditName}
                </a>
                <span className="px-1">•</span>
              </>
            ) : null}
            <span>Posted by u/{authorName}</span>{" "}
            {formatTimeToNow(new Date(createdAt))}
          </div>
          <a href={`/r/${subredditName}/post/${id}`}>
            <h1 className="text-lg font-semibold py-2 leading-6 text-gray-900">
              {title}
            </h1>
          </a>
          <div
            className="relative text-sm max-h-40 w-full overflow-clip"
            ref={pRef}
          >
            <EditorOutput content={content} />
            {pRef.current?.clientHeight === 160 ? (
              <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent" />
            ) : null}
          </div>
        </div>
      </div>
      <div className="bg-gray-50 z-20 text-sm px-4 py-4 sm:px-6">
        <a
          className="w-fit flex items-center gap-2"
          href={`/r/${subredditName}/post/${id}`}
        >
          <MessageSquare className="w-4 h-4" /> {comments.length} comments
        </a>
      </div>
    </div>
  );
};
