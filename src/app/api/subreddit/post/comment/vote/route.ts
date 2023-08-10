import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CommentVoteValidator } from "@/lib/validators/vote";
import { z } from "zod";

export const PATCH = async (req: Request) => {
  try {
    const body = await req.json();
    const { commentId, voteType } = CommentVoteValidator.parse(body);
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    const existingVote = await db.commentVote.findFirst({
      where: {
        commentId,
        userId: session.user.id,
      },
    });

    if (existingVote) {
      if (existingVote.type === voteType) {
        await db.commentVote.delete({
          where: {
            userId_commentId: {
              commentId,
              userId: session.user.id,
            },
          },
        });
      } else {
        await db.commentVote.update({
          where: {
            userId_commentId: {
              commentId,
              userId: session.user.id,
            },
          },
          data: {
            type: voteType,
          },
        });
      }

      return new Response("OK", {
        status: 200,
      });
    }

    await db.commentVote.create({
      data: {
        type: voteType,
        commentId,
        userId: session.user.id,
      },
    });

    return new Response("OK", {
      status: 200,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Could not vote, please try again later", {
      status: 500,
    });
  }
};
