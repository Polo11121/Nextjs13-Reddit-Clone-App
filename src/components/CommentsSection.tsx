import { CreateComment } from "@/components/CreateComment";
import { PostComments } from "@/components/PostComments";

interface PostPageProps {
  postId: string;
}

export const CommentsSection = async ({ postId }: PostPageProps) => (
  <div className="flex flex-col gap-y-4 mt-5">
    <hr className="w-full h-px my-6" />
    <CreateComment postId={postId} />
    {/* @ts-expect-error server component */}
    <PostComments postId={postId} />
  </div>
);
