"use client"

import {
  ArrowDownToLine,
  ArrowUpFromLine,
  BadgeCheck,
  Bell,
  Eye,
  Import,
  List,
  LogOut,
  Settings,
  Settings2,
  Sparkles,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { CaretSortIcon, ComponentPlaceholderIcon } from "@radix-ui/react-icons"
import { Switch } from "./ui/switch"
import { useAtom } from "jotai/react"
import { gridviewAtom, hideHomeFeedAtom } from "@/state"
import { Button } from "./ui/button"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu >
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg flex items-center">
                {/* <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback> */}
                <Settings2 className="stroke-[1.5]" />
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Settings</span>
                {/* <span className="truncate text-xs">{user.email}</span> */}
              </div>
              <CaretSortIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            {/* <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel> */}
            {/* <DropdownMenuSeparator /> */}
            <DropdownMenuGroup>
              {/* <Button variant={"ghost"} onClick={() => document.getElementById("import")?.click()}>Import</Button>
              <input type="file" name="import" id="import" className="hidden" onChange={async (event) => {
                const file = event.target.files?.[0];
                if (!file) return
                // console.log('fired')
                // console.log(file?.name)
                const parser = new DOMParser();
                const text = await file.text()
                const xmlDoc = parser.parseFromString(text, "application/xml");
                const outlineElements = xmlDoc.getElementsByTagName("outline");

                const urls: string[] = [];
                for (const element of Array.from(outlineElements)) {
                  const url = element.getAttribute("xmlUrl");
                  if (url) {
                    urls.push(url);
                  }
                }
                router.push(`/?feeds=${urls.map(encodeURIComponent).join(',')}`)
              }} />
              <Button variant={"ghost"} onClick={() => _export(feeds)}>Export</Button> */}
              <DropdownMenuItem>
                <ArrowDownToLine />
                Import
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ArrowUpFromLine />
                Export
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <HideHomeFeedButton />
              <ViewToggleButton />

              {/* <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem> */}
            </DropdownMenuGroup>
            {/* <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut />
              Log out
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

function HideHomeFeedButton() {
  const [hideHomeFeed, setHideHomeFeed] = useAtom(hideHomeFeedAtom)

  return (
    <DropdownMenuCheckboxItem className="gap-2" onCheckedChange={() => setHideHomeFeed(!hideHomeFeed)} checked={hideHomeFeed}>
      <Eye width={15} height={15} />
      <span>Hide homepage feed</span>
      {/* <Switch id="hide-home-feed-switch" /> */}
    </DropdownMenuCheckboxItem>
  )
}

function ViewToggleButton() {
  const [gridview, setGridview] = useAtom(gridviewAtom)

  return (
    <DropdownMenuCheckboxItem onCheckedChange={() => setGridview(gridview ? false : true)} checked={gridview} className="gap-2">
      {/* {gridview ? : <List width={15} height={15} />} */}
      {/* ph:grid-nine-fill from icones */}
      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 256 256"><path fill="currentColor" d="M84 52v40H28a4 4 0 0 1-4-4V64a16 16 0 0 1 16-16h40a4 4 0 0 1 4 4m16 152a4 4 0 0 0 4 4h48a4 4 0 0 0 4-4v-40h-56Zm-76-36v24a16 16 0 0 0 16 16h40a4 4 0 0 0 4-4v-40H28a4 4 0 0 0-4 4m0-56v32a4 4 0 0 0 4 4h56v-40H28a4 4 0 0 0-4 4m128-64h-48a4 4 0 0 0-4 4v40h56V52a4 4 0 0 0-4-4m76 60h-56v40h56a4 4 0 0 0 4-4v-32a4 4 0 0 0-4-4m-128 40h56v-40h-56ZM216 48h-40a4 4 0 0 0-4 4v40h56a4 4 0 0 0 4-4V64a16 16 0 0 0-16-16m12 116h-56v40a4 4 0 0 0 4 4h40a16 16 0 0 0 16-16v-24a4 4 0 0 0-4-4" /></svg>
      Grid view
    </DropdownMenuCheckboxItem>
  )
}