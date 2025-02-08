'use client'

import { FeedDisplay, FeedsList } from "@/components/feed-display";
import { subscriptionsAtom } from "@/state";
import { useAtom } from "jotai/react";

export default function Page() {
  const [subscriptions] = useAtom(subscriptionsAtom);

  return (
    <div className="w-full flex flex-col gap-10 py-10">
      <h1 className="text-3xl font-medium">All subscriptions</h1>
      <FeedsList feeds={subscriptions} />
    </div>
  )
}