"use client";

import { useForm } from "react-hook-form";
import { UsernameRequest, UsernameValidator } from "@/lib/validators/username";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useUpdateUsername } from "@/actions/useUpdateUsername";

interface UsernameFormProps {
  user: Pick<User, "id" | "username">;
}
export const UsernameForm = ({ user }: UsernameFormProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isDirty },
  } = useForm<UsernameRequest>({
    resolver: zodResolver(UsernameValidator),
    defaultValues: {
      username: user?.username || "",
    },
  });
  const { mutate: updateUsername, isLoading } = useUpdateUsername();

  const submitHandler = handleSubmit((data) => updateUsername(data));

  return (
    <form onSubmit={submitHandler}>
      <Card>
        <CardHeader>
          <CardTitle>Your username</CardTitle>
          <CardDescription>
            Please enter a display name you are comfortable with other people
            seeing on this site. You can change it at any time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative grid gap-1">
            <div className="absolute top-0 left-0 w-8 h-10 grid place-items-center">
              <span className="text-sm text-zinc-400">u/</span>
            </div>
            <Label className="sr-only" htmlFor="name">
              Name
            </Label>
            <Input
              id="name"
              className="w-[400px] pl-6"
              size={32}
              {...register("username")}
            />
            {errors.username && (
              <p className="text-sm px-1 text-red-600">
                {errors.username.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button disabled={isLoading || !isDirty} isLoading={isLoading}>
            Change name
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};
