"use client"

import {
  ChevronDown,
  ChevronUp,
  Folder,
  List,
  Share,
  Trash2,
  type LucideIcon,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { FeedData } from "@extractus/feed-extractor"
import { useAtom } from "jotai/react"
import { subscriptionsAtom } from "@/state"
import { useState } from "react"
import Link from "next/link"

export function NavSubscriptions() {
  const { isMobile } = useSidebar()
  const [feeds] = useAtom(subscriptionsAtom)
  const [expanded, setExpanded] = useState(false)
  const expandedCount = 50
  const collapsedCount = 7

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Subscriptions</SidebarGroupLabel>
      <SidebarMenu>
        {feeds.slice(0, expanded ? expandedCount : collapsedCount).map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild>
              <Link href={`/feed/${encodeURIComponent(item.url)}`}>
                <img
                  src={`https://icons.duckduckgo.com/ip3/${encodeURIComponent(new URL(item.url ?? '').hostname)}.ico`}
                  alt=""
                  className="aspect-square rounded-md w-5 h-5 object-cover" />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <DotsHorizontalIcon />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <Folder className="text-muted-foreground" />
                  <span>View Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share className="text-muted-foreground" />
                  <span>Share Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
          </SidebarMenuItem>
        ))}
        {expanded && (
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/subscriptions">
                <List />
                <span>Show all subscriptions</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
        {feeds.length > collapsedCount && (
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => {
              setExpanded(!expanded)
            }}>
              {expanded ? <ChevronUp /> : <ChevronDown />}
              <span>{expanded ? 'Show less' : 'Show more'}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}
