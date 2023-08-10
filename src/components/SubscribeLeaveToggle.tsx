"use client";

import { useSubscribe } from "@/actions/useSubscribe";
import { Button } from "@/components/ui/Button";

interface SubscribeLeaveToggleProps {
  subredditId: string;
  subredditName: string;
  isSubscribed: boolean;
}

export const SubscribeLeaveToggle = ({
  subredditId,
  subredditName,
  isSubscribed,
}: SubscribeLeaveToggleProps) => {
  const { mutate: toggleSubscribe, isLoading } = useSubscribe({
    subredditName,
    action: isSubscribed ? "unsubscribe" : "subscribe",
  });

  const toggleHandler = () => toggleSubscribe({ subredditId });

  return (
    <Button
      isLoading={isLoading}
      onClick={toggleHandler}
      className="w-full mt-1 mb-4"
    >
      {isSubscribed ? "Leave community" : "Join to post"}
    </Button>
  );
};
