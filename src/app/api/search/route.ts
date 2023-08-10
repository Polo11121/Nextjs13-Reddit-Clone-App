import { db } from "@/lib/db";

export const GET = async (req: Request) => {
  const url = new URL(req.url);
  const q = url.searchParams.get("q");

  if (!q) {
    return new Response("No search query provided", {
      status: 400,
    });
  }

  const subreddits = await db.subreddit.findMany({
    where: {
      name: {
        contains: q,
      },
    },
    include: { _count: true },
    take: 5,
  });

  return new Response(JSON.stringify(subreddits), {
    status: 200,
  });
};
