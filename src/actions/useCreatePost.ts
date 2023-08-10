import { toast } from "@/hooks/useToast";
import { CreatePostRequest } from "@/lib/validators/post";
import { useMutation } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";

export const useCreatePost = () => {
  const pathname = usePathname();
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: CreatePostRequest) => {
      const { data } = await axios.post("/api/subreddit/post/create", payload);

      return data;
    },
    onError: () =>
      toast({
        title: "Something went wrong",
        description: "Check if you subscribe to this post.",
        variant: "destructive",
      }),
    onSuccess: () => {
      const newPathname = pathname.replace("/submit", "");

      router.push(newPathname);
      router.refresh();

      return toast({
        title: "Post created",
        description: "Your post has been created.",
        variant: "default",
      });
    },
  });
};
