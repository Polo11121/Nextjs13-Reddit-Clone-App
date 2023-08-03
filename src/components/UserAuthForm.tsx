"use client";

import { HTMLAttributes, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/Button";
import { set } from "date-fns";
import { signIn } from "next-auth/react";
import { Icons } from "./Icons";
import { useToast } from "@/hooks/useToast";

interface UserAuthFormProps extends HTMLAttributes<HTMLDivElement> {}

export const UserAuthForm = ({ className, ...props }: UserAuthFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loginHandler = async () => {
    setIsLoading(true);

    try {
      await signIn("google");
    } catch (error) {
      toast({
        title: "There was a problem.",
        description:
          "There was a problem logging you in with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div {...props} className={cn("flex justify-center", className)}>
      <Button
        onClick={loginHandler}
        isLoading={isLoading}
        size="sm"
        className="w-full"
      >
        {!isLoading && <Icons.google className="h-4 w-4 mr-2" />}
        Google
      </Button>
    </div>
  );
};
