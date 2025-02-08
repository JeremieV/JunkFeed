"use client"

import {
  Folder,
  Home,
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
import Link from "next/link"

export function NavFeatures() {
  const { isMobile } = useSidebar()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="sr-only">Feeds</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link href="/">
              <Home />
              <span>Home</span>
            </Link>
          </SidebarMenuButton>
          {/* <SidebarMenuButton asChild>
            <Link href="hot">
              <Folder />
              <span>Hot</span>
            </Link>
          </SidebarMenuButton>
          <SidebarMenuButton asChild>
            <Link href={"new"}>
              <Folder />
              <span>New</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton>
            <DotsHorizontalIcon />
            <span>More</span>
          </SidebarMenuButton> */}
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
