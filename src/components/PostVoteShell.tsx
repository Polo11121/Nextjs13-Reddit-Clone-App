import { ArrowBigDown, ArrowBigUp, Loader2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";

export const PostVoteShell = () => (
  <div className="flex items-center flex-col pr-6 w-20">
    <div
      className={buttonVariants({
        variant: "ghost",
      })}
    >
      <ArrowBigUp className="w-5 h-5 text-zinc-700" />
    </div>
    <div className="text-center py-2 font-medium text-sm text-zinc-900">
      <Loader2 className="h3 w-3 animate-spin" />
    </div>
    <div
      className={buttonVariants({
        variant: "ghost",
      })}
    >
      <ArrowBigDown className="w-5 h-5 text-zinc-700" />
    </div>
  </div>
);
