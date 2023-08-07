"use client";

import { useSubscribeToSubreddit } from "@/actions/useSubscribeToSubreddit";
import { useUnsubscribeFromSubreddit } from "@/actions/useUnsubscribeFromSubreddit";
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
  const { mutate: subscribe, isLoading: isSubscribeLoading } =
    useSubscribeToSubreddit(subredditName);
  const { mutate: unsubscribe, isLoading: isUnsubscribeLoading } =
    useUnsubscribeFromSubreddit(subredditName);

  const subscribeHandler = () => subscribe({ subredditId });
  const unsubscribeHandler = () => unsubscribe({ subredditId });

  return isSubscribed ? (
    <Button
      isLoading={isUnsubscribeLoading}
      onClick={unsubscribeHandler}
      className="w-full mt-1 mb-4"
    >
      Leave community
    </Button>
  ) : (
    <Button
      isLoading={isSubscribeLoading}
      onClick={subscribeHandler}
      className="w-full mt-1 mb-4"
    >
      Join to post
    </Button>
  );
};
