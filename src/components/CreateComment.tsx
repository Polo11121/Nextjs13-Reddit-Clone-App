"use client";

import { useState } from "react";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useCreateComment } from "@/actions/useCreateComment";

interface CreateCommentProps {
  postId: string;
  replyToId?: string;
  onCancel?: () => void;
}

export const CreateComment = ({
  postId,
  replyToId,
  onCancel,
}: CreateCommentProps) => {
  const [input, setInput] = useState("");

  const onSuccess = () => {
    if (onCancel) {
      onCancel();
    }

    setInput("");
  };

  const { mutate: createPost, isLoading } = useCreateComment(onSuccess);

  const changeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setInput(e.target.value);

  const createPostHandler = () =>
    createPost({
      postId,
      text: input,
      replyToId,
    });

  return (
    <div className="gird w-full gap-1.5">
      <Label>Your comment</Label>
      <div className="mt-2">
        <Textarea
          id="comment"
          value={input}
          onChange={changeHandler}
          rows={1}
          placeholder="What are your thoughts?"
        />
        <div className="mt-2 gap-2 flex justify-end">
          {onCancel && (
            <Button onClick={onCancel} tabIndex={-1} variant="subtle">
              Cancel
            </Button>
          )}
          <Button
            onClick={createPostHandler}
            isLoading={isLoading}
            disabled={!input.length || isLoading}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};
