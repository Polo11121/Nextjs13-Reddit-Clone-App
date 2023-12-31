import { Icons } from "@/components/ui/Icons";
import { UserAuthForm } from "@/components/UserAuthForm";
import Link from "next/link";

export const SignIn = () => (
  <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
    <div className="flex flex-col space-y-2 text-center">
      <Icons.logo className="mx-auto h-6 w-6" />
      <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
      <p className="text-sm max-w-xs mx-auto">
        By continuing, you are setting up a Breadit account and agree to our
        User Agreement and Privacy Policy.
      </p>
      <UserAuthForm className="" />
      <p className="px-8 text-center text-sm text-zinc-700">
        New to Breadit?{" "}
        <Link
          className="hover:text-zinc-800 text-sm underline underline-offset-4"
          href="/sign-up"
        >
          Sign Up
        </Link>
      </p>
    </div>
  </div>
);
