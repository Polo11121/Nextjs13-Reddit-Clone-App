"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { useCreateSubreddit } from "@/actions/useCreateSubreddit";

const CreateCommunityPage = () => {
  const [input, setInput] = useState("");

  const router = useRouter();

  const { mutate: createCommunity, isLoading } = useCreateSubreddit();

  const changeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const goBackHandler = () => router.back();

  const submitHandler = () => createCommunity({ name: input });

  return (
    <div className="container flex items-center h-full max-w-3xl mx-auto">
      <div className="relative bg-white w-full h-fit p-4 rounded-lg space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xls font-semibold">Create a community</h1>
        </div>
        <hr className="bg-zinc-500 h-px" />
        <div>
          <p className="text-lg font-medium">Name</p>
          <p className="text-xs pb-2">
            Community names including capitalization cannot be changed.
          </p>
          <div className="relative">
            <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400">
              /r
            </p>
            <Input
              value={input}
              onChange={changeInputHandler}
              className="pl-6"
            />
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Button onClick={goBackHandler} variant="subtle">
            Cancel
          </Button>
          <Button
            isLoading={isLoading}
            disabled={!input || isLoading}
            onClick={submitHandler}
          >
            Create community
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateCommunityPage;
