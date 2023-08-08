import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { CachedPost } from "@/types/redis";
import { PostVoteValidator } from "@/lib/validators/vote";
import { z } from "zod";

const CACHE_AFTER_UPVOTES = 1;

export const PATCH = async (req: Request) => {
  try {
    const body = await req.json();
    const { postId, voteType } = PostVoteValidator.parse(body);
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    const existingVote = await db.vote.findFirst({
      where: {
        postId,
        userId: session.user.id,
      },
    });
    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        votes: true,
        author: true,
      },
    });

    if (!post) {
      return new Response("Post not found", {
        status: 404,
      });
    }

    const votesAmount = post.votes.reduce(
      (acc, vote) => (vote.type === "UP" ? acc + 1 : acc - 1),
      0
    );

    if (existingVote) {
      if (existingVote.type === voteType) {
        await db.vote.delete({
          where: {
            userId_postId: {
              postId,
              userId: session.user.id,
            },
          },
        });
        return new Response("OK", {
          status: 200,
        });
      }

      await db.vote.update({
        where: {
          userId_postId: {
            postId,
            userId: session.user.id,
          },
        },
        data: {
          type: voteType,
        },
      });

      if (votesAmount >= CACHE_AFTER_UPVOTES) {
        const cachedPayload: CachedPost = {
          id: post.id,
          title: post.title,
          authorUsername: post.author.username ?? "",
          content: post.content,
          createdAt: post.createdAt,
          currentVote: voteType,
        };

        await redis.hset(`post:${post.id}`, cachedPayload);
      }

      return new Response("OK", {
        status: 200,
      });
    }

    await db.vote.create({
      data: {
        type: voteType,
        postId,
        userId: session.user.id,
      },
    });

    if (votesAmount >= CACHE_AFTER_UPVOTES) {
      const cachedPayload: CachedPost = {
        id: post.id,
        title: post.title,
        authorUsername: post.author.username ?? "",
        content: post.content,
        createdAt: post.createdAt,
        currentVote: voteType,
      };

      await redis.hset(`post:${post.id}`, cachedPayload);
    }

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
