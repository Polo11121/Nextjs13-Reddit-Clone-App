import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CommentValidator } from "@/lib/validators/comment";
import { z } from "zod";

export const PATCH = async (req: Request) => {
  try {
    const body = await req.json();
    const session = await getAuthSession();

    const { postId, text, replyToId } = CommentValidator.parse(body);

    if (!session?.user) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    await db.comment.create({
      data: {
        postId,
        text,
        replyToId,
        authorId: session.user.id,
      },
    });

    return new Response("OK", { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response(
      "Could not add comment to post at this time, please try again later.",
      {
        status: 500,
      }
    );
  }
};
