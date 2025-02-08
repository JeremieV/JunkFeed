"use client"

import { useAtom } from "jotai/react";
import Stories from './Stories'
import { gridviewAtom, subscriptionsAtom } from "@/state";
import { Button, buttonVariants } from "@/components/ui/button";
import { _export, _import } from "@/lib/helpers";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils";
import { List, SearchIcon } from "lucide-react";
import Link from "next/link";
import { createContext, useState } from "react";

export const FeedsContext = createContext<string[]>([])

export default function Page() {
  // const feeds = searchParams.feeds?.split(',').filter(x => x).map(decodeURIComponent) || []

  const [subscriptions, setSubscriptions] = useAtom(subscriptionsAtom)

  const [homeFeed, setHomeFeed] = useState('Subscriptions')

  const recommendedFeeds = [
    { title: 'Subscriptions', link: subscriptions.map(f => f.url) },
    { title: 'Hacker News', link: ['http://news.ycombinator.com/rss'] },
    { title: 'Lobsters', link: ['https://lobste.rs/rss'] },
  ]

  return (
    <div>
      <div className="flex gap-2 overflow-x-scroll pb-4">
        {[recommendedFeeds.find(f => f.title === homeFeed)!, ...recommendedFeeds.filter(f => f.title !== homeFeed)].map((f, i) => (
          <Button variant={i === 0 ? "secondary" : "outline"} className="rounded-full" onClick={() => setHomeFeed(f.title)}>{f.title}</Button>
        ))}
      </div>
      <div className="flex flex-col grow py-4" id="top">
        <Stories feeds={recommendedFeeds.find(i => i.title === homeFeed)?.link ?? []}></Stories>
      </div>
    </div>
  )
}
