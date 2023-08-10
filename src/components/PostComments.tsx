import { PostComment } from "@/components/PostComment";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Comment, CommentVote, User } from "@prisma/client";

type Replay = Comment & {
  author: User;
  votes: CommentVote[];
};

type CommentExtended = Comment & {
  author: User;
  votes: CommentVote[];
  replies: Replay[];
};

interface PostCommentsProps {
  postId: string;
}

export const PostComments = async ({ postId }: PostCommentsProps) => {
  const session = await getAuthSession();
  const comments = await db.comment.findMany({
    where: { replyToId: null, postId },
    include: {
      author: true,
      votes: true,
      replies: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const getCommentVotesAmount = (comment: CommentExtended | Replay) =>
    comment.votes.reduce(
      (acc, vote) => (acc + vote.type === "UP" ? acc + 1 : acc - 1),
      0
    );

  const getCommentUserVote = (comment: CommentExtended | Replay) =>
    comment.votes.find((vote) => vote.userId === session?.user.id)?.type;

  return (
    <div className="flex flex-col gap-y-4 mt-4 ">
      {comments
        .filter(({ replyToId }) => !replyToId)
        .map((comment) => {
          const commentVotesAmount = getCommentVotesAmount(comment);
          const commentVote = getCommentUserVote(comment);

          return (
            <div key={comment.id} className="flex flex-col">
              <div className="mb-2">
                <PostComment
                  postId={postId}
                  comment={comment}
                  commentVotesAmount={commentVotesAmount}
                  initialVote={commentVote}
                />
              </div>
              {comment.replies
                .sort((a, b) => b.votes.length - a.votes.length)
                .map((reply) => {
                  const replyVotesAmount = getCommentVotesAmount(reply);
                  const replyVote = getCommentUserVote(reply);

                  return (
                    <div
                      key={reply.id}
                      className="ml-2 py-2 pl-4 border-l-2 border-zinc-200"
                    >
                      <PostComment
                        postId={postId}
                        comment={reply}
                        commentVotesAmount={replyVotesAmount}
                        initialVote={replyVote}
                      />
                    </div>
                  );
                })}
            </div>
          );
        })}
    </div>
  );
};
