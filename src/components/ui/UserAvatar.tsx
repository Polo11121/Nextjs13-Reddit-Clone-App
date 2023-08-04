import { Avatar, AvatarFallback } from "@/components/ui/Avatar";
import { User } from "next-auth";
import { Icons } from "@/components/ui/Icons";
import { AvatarProps } from "@radix-ui/react-avatar";
import Image from "next/image";

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "name" | "image">;
}

export const UserAvatar = ({ user, ...props }: UserAvatarProps) => (
  <Avatar {...props}>
    {user.image ? (
      <div className="relative aspect-square h-full w-full">
        <Image
          fill
          src={user.image}
          alt="profile-picture"
          referrerPolicy="no-referrer"
        />
      </div>
    ) : (
      <AvatarFallback>
        <span className="sr-only">{user?.name}</span>
        <Icons.user className=" h-4 w-4" />
      </AvatarFallback>
    )}
  </Avatar>
);
