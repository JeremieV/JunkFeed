"use client"

import * as React from "react"
import {
  Command,
} from "lucide-react"

import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { DiscordLogoIcon, GitHubLogoIcon, PersonIcon } from "@radix-ui/react-icons"
import { useFeeds } from "@/lib/queries"
import { FeedsContext } from "@/app/page"
import { NavFeeds } from "./nav-feeds"
import { NavSubscriptions } from "./nav-subscriptions"
import { NavFeatures } from "./nav-features"
import Link from "next/link"
import { useRouter } from "next/navigation"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navSecondary: [
    {
      title: "Made by Jérémie Vaney",
      url: "https://jeremievaney.com",
      icon: PersonIcon,
    },
    {
      title: "Source code",
      url: "https://github.com/jeremiev/TODO",
      icon: GitHubLogoIcon,
    },
    {
      title: "Join the community",
      url: "#",
      icon: DiscordLogoIcon, // or slack
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const feeds = React.useContext(FeedsContext)
  const feedQ = useFeeds(feeds)

  const folders = feedQ.data
    ?.flatMap((r) => r.folders)
    .filter((folder) => folder !== undefined)

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Stateless feed</span>
                  <span className="truncate text-xs">Open source feed reader</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavFeatures />
        {/* TODO make sure this works and filterable by folder */}
        {folders && folders.length > 0 && (
          <NavFeeds feeds={folders ?? []} />
        )}
        <NavSubscriptions />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
