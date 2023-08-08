"use client";

import { useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import { ExtendedPost } from "@/types/db";
import { useInfiniteQuery } from "@tanstack/react-query";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { useSession } from "next-auth/react";
import { Post } from "@/components/Post";
import axios from "axios";

interface PostFeedProps {
  initialPosts: ExtendedPost[];
  subredditName?: string;
}

export const PostFeed = ({ initialPosts, subredditName }: PostFeedProps) => {
  const lastPostRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });
  const { data: session } = useSession();

  const { data, fetchNextPage } = useInfiniteQuery(
    ["infinite-query"],
    async ({ pageParam = 1 }) => {
      const query = `/api/posts?page=${pageParam}&limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}${
        subredditName ? `&subredditName=${subredditName}` : ""
      }`;

      const { data } = await axios.get(query);

      return data as ExtendedPost[];
    },
    {
      getNextPageParam: (_, pages) => pages.length + 1,
      initialData: {
        pages: [initialPosts],
        pageParams: [1],
      },
    }
  );

  const posts = data?.pages.flatMap((page) => page) ?? initialPosts;

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  return (
    <ul className="flex flex-col col-span-2 space-y-6">
      {posts.map((post, index) => {
        const votesAmount = post.votes.reduce(
          (acc, vote) => (vote.type === "UP" ? acc + 1 : acc - 1),
          0
        );
        const currentVote = post.votes.find(
          (vote) => vote.userId === session?.user.id
        );

        return index === posts.length - 1 ? (
          <li key={post.id} ref={ref}>
            <Post
              post={post}
              votesAmount={votesAmount}
              currentVote={currentVote}
            />
          </li>
        ) : (
          <li key={post.id}>
            <Post
              post={post}
              votesAmount={votesAmount}
              currentVote={currentVote}
            />
          </li>
        );
      })}
    </ul>
  );
};
